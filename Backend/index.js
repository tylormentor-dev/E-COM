import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

function buildPlaceholderImage(label, bg = "#1f6feb", fg = "#ffffff") {
  const text = String(label || "Image").slice(0, 36);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='${fg}' font-family='Arial, sans-serif'>${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeImage(image, label, bg) {
  if (typeof image === "string") {
    const trimmed = image.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:image/")
    ) {
      return trimmed;
    }
  }
  return buildPlaceholderImage(label, bg);
}

async function ensureCompatibility() {
  const bookingColumns = [
    "client_name VARCHAR(255) NULL",
    "contact VARCHAR(255) NULL",
    "year INT NULL",
    "description TEXT NULL",
    "location VARCHAR(255) NULL",
    "scheduled_at DATETIME NULL",
  ];

  for (const definition of bookingColumns) {
    try {
      await pool.query(`ALTER TABLE bookings ADD COLUMN ${definition}`);
    } catch (error) {
      // 1060 => duplicate column name (already exists)
      if (error?.errno !== 1060) throw error;
    }
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/cars", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        c.*,
        u.fullname AS dealer_name,
        (
          SELECT ci.image_url
          FROM car_images ci
          WHERE ci.car_id = c.id
          ORDER BY ci.id ASC
          LIMIT 1
        ) AS image
      FROM car_listing c
      LEFT JOIN users u ON u.id = c.seller_id
      ORDER BY c.created_at DESC
      `,
    );

    const enriched = rows.map((car) => ({
      ...car,
      image: normalizeImage(
        car.image,
        `${car.name || "Car"} ${car.model || ""}`.trim(),
        "#0d47a1",
      ),
    }));
    return res.json(enriched);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({ error: "Failed to fetch cars" });
  }
});

app.get("/spares", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM car_parts ORDER BY created_at DESC");
    const enriched = rows.map((part) => ({
      ...part,
      image: normalizeImage(part.image, part.name || "Spare Part", "#215732"),
    }));
    return res.json(enriched);
  } catch (error) {
    console.error("Error fetching spares:", error);
    return res.status(500).json({ error: "Failed to fetch spares" });
  }
});

app.get("/locations", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT location FROM mechanics WHERE location IS NOT NULL AND location <> '' ORDER BY location",
    );
    return res.json(rows.map((r) => r.location));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return res.status(500).json({ error: "Failed to fetch locations" });
  }
});

app.get("/mechanics", async (req, res) => {
  const location = req.query.location || req.query.city || null;

  try {
    if (location) {
      const [rows] = await pool.query(
        `
        SELECT
          m.id,
          m.user_id,
          u.fullname,
          u.email,
          u.phone,
          m.location,
          m.bio,
          m.years_experience,
          m.rating,
          m.availability,
          m.notes_on_pricing
        FROM mechanics m
        JOIN users u ON u.id = m.user_id
        WHERE m.location = ?
        ORDER BY m.rating DESC, m.id DESC
        `,
        [location],
      );
      return res.json(rows);
    }

    const [rows] = await pool.query(
      `
      SELECT
        m.id,
        m.user_id,
        u.fullname,
        u.email,
        u.phone,
        m.location,
        m.bio,
        m.years_experience,
        m.rating,
        m.availability,
        m.notes_on_pricing
      FROM mechanics m
      JOIN users u ON u.id = m.user_id
      ORDER BY m.rating DESC, m.id DESC
      `,
    );
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching mechanics:", error);
    return res.status(500).json({ error: "Failed to fetch mechanics" });
  }
});

app.get("/mechanics/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        m.*,
        u.fullname,
        u.email,
        u.phone,
        u.address
      FROM mechanics m
      JOIN users u ON u.id = m.user_id
      WHERE m.id = ?
      `,
      [req.params.id],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Mechanic not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching mechanic:", error);
    return res.status(500).json({ error: "Failed to fetch mechanic" });
  }
});

async function registerUser(req, res) {
  const fullname = req.body.fullname || req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone || null;
  const idNumber = req.body.id_number || null;
  const dob = req.body.dob || null;
  const address = req.body.address || req.body.location || null;
  const role = ["customer", "mechanic", "admin"].includes(req.body.role)
    ? req.body.role
    : "customer";

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "fullname, email and password required" });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [created] = await pool.query(
      `
      INSERT INTO users (fullname, email, phone, address, id_number, password_hash, dob, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [fullname, email, phone, address, idNumber, passwordHash, dob, role],
    );

    const userId = created.insertId;

    if (role === "mechanic") {
      const location = req.body.location || (address ? String(address).split(",").pop()?.trim() : null);
      await pool.query(
        `
        INSERT INTO mechanics (user_id, location)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE location = VALUES(location)
        `,
        [userId, location || null],
      );
    }

    const token = signToken({ id: userId, email, role });
    return res.status(201).json({
      id: userId,
      email,
      fullname,
      phone,
      address,
      id_number: idNumber,
      dob,
      profile_image: null,
      role,
      token,
    });
  } catch (error) {
    console.error("Error during register:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
}

app.post("/signup", registerUser);
app.post("/register", registerUser);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.json({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      phone: user.phone,
      address: user.address,
      dob: user.dob,
      id_number: user.id_number,
      profile_image: user.profile_image,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/verify", auth, (req, res) => {
  return res.json({ valid: true, user: req.user });
});

app.get("/user", auth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    return res.json({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      id_number: user.id_number,
      dob: user.dob,
      profile_image: user.profile_image,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.get("/orders", auth, async (req, res) => {
  try {
    const params = [req.user.id];
    let sql = "SELECT * FROM orders WHERE user_id = ?";

    if (req.query.status) {
      sql += " AND status = ?";
      params.push(req.query.status);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/orders/:orderId", auth, async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders WHERE id = ? AND user_id = ?", [
      req.params.orderId,
      req.user.id,
    ]);

    if (!orders.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [items] = await pool.query(
      `
      SELECT
        oi.id AS item_id,
        oi.order_id,
        oi.car_id,
        oi.part_id,
        oi.quantity,
        oi.price,
        COALESCE(cl.name, cp.name) AS item_name,
        COALESCE(cl.model, CONCAT(cp.category, ' - ', cp.size)) AS item_description,
        CASE WHEN oi.car_id IS NOT NULL THEN 'car' ELSE 'part' END AS item_type
      FROM order_items oi
      LEFT JOIN car_listing cl ON oi.car_id = cl.id
      LEFT JOIN car_parts cp ON oi.part_id = cp.id
      WHERE oi.order_id = ?
      `,
      [req.params.orderId],
    );

    return res.json({ ...orders[0], items });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ error: "Failed to fetch order details" });
  }
});

app.post("/orders/create", auth, async (req, res) => {
  const { items, total_price } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }

  try {
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
      [req.user.id, total_price || 0],
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      if (item.part_id) {
        await pool.query(
          "INSERT INTO order_items (order_id, part_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.part_id, item.quantity || 1, item.price || 0],
        );
      } else if (item.car_id) {
        await pool.query(
          "INSERT INTO order_items (order_id, car_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.car_id, item.quantity || 1, item.price || 0],
        );
      }
    }

    return res.status(201).json({
      id: orderId,
      user_id: req.user.id,
      total_price,
      status: "pending",
      items_count: items.length,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/orders/:orderId/cancel", auth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? AND user_id = ?", [
      req.params.orderId,
      req.user.id,
    ]);

    if (!rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (rows[0].status !== "pending") {
      return res.status(400).json({ error: "Only pending orders can be cancelled" });
    }

    await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [req.params.orderId]);
    return res.json({ success: true, id: Number(req.params.orderId), status: "cancelled" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ error: "Failed to cancel order" });
  }
});

app.post("/bookings", auth, async (req, res) => {
  const mechanicId = req.body.mechanic_id;
  if (!mechanicId) {
    return res.status(400).json({ error: "mechanic_id is required" });
  }

  try {
    const [mechanicRows] = await pool.query("SELECT id FROM mechanics WHERE id = ?", [mechanicId]);
    if (!mechanicRows.length) {
      return res.status(404).json({ error: "Mechanic not found" });
    }

    let serviceId = req.body.service_id || null;
    let totalPrice = Number(req.body.price_offer || 0);

    if (!serviceId) {
      const [serviceRows] = await pool.query(
        "SELECT id, price FROM services WHERE mechanic_id = ? ORDER BY id ASC LIMIT 1",
        [mechanicId],
      );

      if (serviceRows.length) {
        serviceId = serviceRows[0].id;
        if (!totalPrice) totalPrice = Number(serviceRows[0].price || 0);
      } else {
        const [newService] = await pool.query(
          `
          INSERT INTO services (name, description, duration, price, mechanic_id)
          VALUES ('General Service', 'Auto-generated service', '01:00:00', ?, ?)
          `,
          [totalPrice || 0, mechanicId],
        );
        serviceId = newService.insertId;
      }
    }

    const bookingDate = req.body.booking_date || req.body.scheduled_at || new Date();

    const [result] = await pool.query(
      `
      INSERT INTO bookings
        (mechanic_id, service_id, user_id, booking_date, status, car_model, total_price, payment_method, client_name, contact, year, description, location, scheduled_at)
      VALUES
        (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        mechanicId,
        serviceId,
        req.user.id,
        bookingDate,
        req.body.carModel || req.body.car_model || "Unknown",
        totalPrice,
        req.body.payment_method || "cash",
        req.body.clientName || null,
        req.body.contact || null,
        req.body.year || null,
        req.body.description || null,
        req.body.location || null,
        req.body.scheduled_at || null,
      ],
    );

    return res.status(201).json({ id: result.insertId, status: "pending" });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Failed to create booking" });
  }
});

app.get("/bookings", auth, async (req, res) => {
  try {
    if (req.user.role === "mechanic") {
      const [mechanicRows] = await pool.query("SELECT id, location FROM mechanics WHERE user_id = ?", [
        req.user.id,
      ]);
      if (!mechanicRows.length) return res.json([]);

      const mechanic = mechanicRows[0];
      const [rows] = await pool.query(
        `
        SELECT
          b.*,
          COALESCE(u.fullname, b.client_name) AS client_fullname,
          COALESCE(b.contact, u.phone) AS contact,
          COALESCE(b.location, u.address) AS location
        FROM bookings b
        LEFT JOIN users u ON u.id = b.user_id
        WHERE b.mechanic_id = ?
          AND (
            ? IS NULL
            OR b.location = ?
            OR u.address LIKE CONCAT('%', ?, '%')
          )
        ORDER BY b.created_at DESC
        `,
        [mechanic.id, mechanic.location, mechanic.location, mechanic.location],
      );

      return res.json(rows);
    }

    const [rows] = await pool.query(
      `
      SELECT
        b.*,
        mu.fullname AS mechanic_name,
        COALESCE(b.contact, u.phone) AS contact,
        COALESCE(b.location, u.address) AS location
      FROM bookings b
      LEFT JOIN users u ON u.id = b.user_id
      LEFT JOIN mechanics m ON m.id = b.mechanic_id
      LEFT JOIN users mu ON mu.id = m.user_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      `,
      [req.user.id],
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post("/bookings/:id/accept", auth, requireRole("mechanic"), async (req, res) => {
  try {
    const [mechanicRows] = await pool.query("SELECT id FROM mechanics WHERE user_id = ?", [req.user.id]);
    if (!mechanicRows.length) return res.status(404).json({ error: "Mechanic profile not found" });

    const mechanicId = mechanicRows[0].id;
    const bookingId = Number(req.params.id);

    const [bookingRows] = await pool.query(
      "SELECT * FROM bookings WHERE id = ? AND mechanic_id = ?",
      [bookingId, mechanicId],
    );
    if (!bookingRows.length) return res.status(404).json({ error: "Booking not found" });
    if (bookingRows[0].status !== "pending") {
      return res.status(400).json({ error: "Only pending bookings can be accepted" });
    }

    await pool.query("UPDATE bookings SET status = 'accepted', confirmed_at = NOW() WHERE id = ?", [
      bookingId,
    ]);
    return res.json({ success: true, id: bookingId, status: "accepted" });
  } catch (error) {
    console.error("Error accepting booking:", error);
    return res.status(500).json({ error: "Failed to accept booking" });
  }
});

app.post("/bookings/:id/reject", auth, requireRole("mechanic"), async (req, res) => {
  try {
    const [mechanicRows] = await pool.query("SELECT id FROM mechanics WHERE user_id = ?", [req.user.id]);
    if (!mechanicRows.length) return res.status(404).json({ error: "Mechanic profile not found" });

    const mechanicId = mechanicRows[0].id;
    const bookingId = Number(req.params.id);

    const [bookingRows] = await pool.query(
      "SELECT * FROM bookings WHERE id = ? AND mechanic_id = ?",
      [bookingId, mechanicId],
    );
    if (!bookingRows.length) return res.status(404).json({ error: "Booking not found" });
    if (bookingRows[0].status !== "pending") {
      return res.status(400).json({ error: "Only pending bookings can be rejected" });
    }

    await pool.query("UPDATE bookings SET status = 'rejected' WHERE id = ?", [bookingId]);
    return res.json({ success: true, id: bookingId, status: "rejected" });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    return res.status(500).json({ error: "Failed to reject booking" });
  }
});

app.post("/bookings/:id/cancel", auth, async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const [bookingRows] = await pool.query("SELECT * FROM bookings WHERE id = ? AND user_id = ?", [
      bookingId,
      req.user.id,
    ]);
    if (!bookingRows.length) return res.status(404).json({ error: "Booking not found" });
    if (bookingRows[0].status !== "pending") {
      return res.status(400).json({ error: "Only pending bookings can be cancelled" });
    }

    await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [bookingId]);
    return res.json({ success: true, id: bookingId, status: "cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
});

app.put("/bookings/:id/status", auth, requireRole("mechanic"), async (req, res) => {
  const statusMap = {
    approved: "accepted",
    denied: "rejected",
    renegotiating: "pending",
    pending: "pending",
    accepted: "accepted",
    rejected: "rejected",
    completed: "completed",
    cancelled: "cancelled",
  };

  const requested = String(req.body.status || "").toLowerCase();
  const mapped = statusMap[requested];
  if (!mapped) return res.status(400).json({ error: "Invalid status" });

  try {
    const [mechanicRows] = await pool.query("SELECT id FROM mechanics WHERE user_id = ?", [req.user.id]);
    if (!mechanicRows.length) return res.status(404).json({ error: "Mechanic profile not found" });

    const mechanicId = mechanicRows[0].id;
    const bookingId = Number(req.params.id);

    const [bookingRows] = await pool.query(
      "SELECT id FROM bookings WHERE id = ? AND mechanic_id = ?",
      [bookingId, mechanicId],
    );
    if (!bookingRows.length) return res.status(404).json({ error: "Booking not found" });

    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [mapped, bookingId]);
    return res.json({ success: true, id: bookingId, status: mapped });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ error: "Failed to update booking status" });
  }
});

app.post("/payments/stripe/create-checkout-session", auth, (req, res) => {
  return res.json({
    message: "Stripe test placeholder ready.",
  });
});

app.post("/payments/stripe/webhook", (req, res) => {
  return res.json({ received: true, message: "Stripe webhook placeholder" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

ensureCompatibility()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize compatibility layer", error);
    process.exit(1);
  });
