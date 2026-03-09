import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, city } = req.body;

  const [existing] = await query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) throw new ApiError(409, "Email already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await query(
    `
    INSERT INTO users (name, email, password, role, phone, city)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, email, passwordHash, role, phone || null, city || null],
  );

  if (role === "mechanic") {
    await query(
      `
      INSERT INTO mechanics (user_id, workshop_name, service_categories, subscription_plan, subscription_status, verified)
      VALUES (?, ?, JSON_ARRAY(), ?, 'inactive', false)
      `,
      [result.insertId, `${name}'s Workshop`, "starter"],
    );
  }

  if (role === "dealer") {
    await query(
      `
      INSERT INTO dealers (user_id, dealership_name, subscription_plan, verified)
      VALUES (?, ?, ?, false)
      `,
      [result.insertId, `${name} Auto`, "starter"],
    );
  }

  const token = signToken({ id: result.insertId, role, email });
  return res.status(201).json({
    token,
    user: { id: result.insertId, name, email, role, phone, city },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await query(
    "SELECT id, name, email, password, role, phone, city FROM users WHERE email = ?",
    [email],
  );
  if (!rows.length) throw new ApiError(401, "Invalid credentials");

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
    },
  });
});
