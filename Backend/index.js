import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_prod';

app.use(cors());
app.use(express.json());
app.get('/cars', async (req, res) => {
  try{
    const [rows] = await pool.query('SELECT * FROM car_listing');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.get('/spares', async (req, res) => {
  try{
    const [rows] = await pool.query('SELECT * FROM car_parts');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching spares:', error);
    res.status(500).json({ error: 'Failed to fetch spares' });
  }
});

// Get distinct mechanic locations
app.get('/locations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT location FROM mechanics WHERE location IS NOT NULL');
    const locations = rows.map(r => r.location);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get mechanics for a given location
app.get('/mechanics', async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: 'location query parameter is required' });
  try {
    const sql = `SELECT m.*, u.fullname, u.email, u.phone, u.address
                 FROM mechanics m
                 LEFT JOIN users u ON m.user_id = u.id
                 WHERE m.location = ?`;
    const [rows] = await pool.query(sql, [location]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    res.status(500).json({ error: 'Failed to fetch mechanics' });
  }
});

// Create a simple table to store incoming service requests and insert a request
app.post('/requests', async (req, res) => {
  const { clientName, contact, carModel, year, description, location } = req.body;
  if (!clientName || !contact || !carModel || !year || !description || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Ensure table exists
    const createSql = `
      CREATE TABLE IF NOT EXISTS service_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255),
        contact VARCHAR(255),
        car_model VARCHAR(255),
        year INT,
        description TEXT,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;
    await pool.query(createSql);

    const insertSql = `INSERT INTO service_requests (client_name, contact, car_model, year, description, location) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(insertSql, [clientName, contact, carModel, year, description, location]);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error storing request:', error);
    res.status(500).json({ error: 'Failed to store request' });
  }
});

// Auth Endpoints
// POST /signup - Register a new user
app.post('/signup', async (req, res) => {
  const { fullname, email, password, phone, address, role } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'fullname, email, and password required' });
  }

  try {
    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const userRole = role && (role === 'mechanic' || role === 'admin') ? role : 'customer';
    const sql = 'INSERT INTO users (fullname, email, password_hash, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(sql, [fullname, email, passwordHash, phone || null, address || null, userRole]);

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email, role: userRole }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      id: userId, 
      email, 
      fullname, 
      phone: phone || null,
      address: address || null,
      role: userRole, 
      token 
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /login - Authenticate user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      id: user.id, 
      email: user.email, 
      fullname: user.fullname, 
      phone: user.phone,
      address: user.address,
      dob: user.dob,
      id_number: user.id_number,
      profile_image: user.profile_image,
      role: user.role, 
      token 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /verify - Verify JWT token
app.get('/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /user - Get current logged-in user details
app.get('/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.json({
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
      updated_at: user.updated_at
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /orders - Get all orders for the logged-in user
app.get('/orders', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { status } = req.query; // optional filter by status

    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const [orders] = await pool.query(sql, params);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /orders/:orderId - Get order details with items
app.get('/orders/:orderId', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { orderId } = req.params;
    const userId = decoded.id;

    // Fetch order
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderRows[0];

    // Fetch order items with car or part details
    const [itemRows] = await pool.query(`
      SELECT 
        oi.id as item_id,
        oi.order_id,
        oi.car_id,
        oi.part_id,
        oi.quantity,
        oi.price,
        COALESCE(cl.name, cp.name) as item_name,
        COALESCE(cl.model, CONCAT(cp.category, ' - ', cp.size)) as item_description,
        CASE WHEN oi.car_id IS NOT NULL THEN 'car' ELSE 'part' END as item_type
      FROM order_items oi
      LEFT JOIN car_listing cl ON oi.car_id = cl.id
      LEFT JOIN car_parts cp ON oi.part_id = cp.id
      WHERE oi.order_id = ?
    `, [orderId]);

    res.json({
      ...order,
      items: itemRows
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /orders/create - Create a new order from cart items
app.post('/orders/create', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { items, total_price } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Create order
    const [orderResult] = await pool.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
      [userId, total_price || 0, 'pending']
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of items) {
      if (item.part_id) {
        await pool.query(
          'INSERT INTO order_items (order_id, part_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.part_id, item.quantity, item.price]
        );
      } else if (item.car_id) {
        await pool.query(
          'INSERT INTO order_items (order_id, car_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.car_id, item.quantity || 1, item.price || 0]
        );
      }
    }

    res.status(201).json({
      id: orderId,
      user_id: userId,
      total_price,
      status: 'pending',
      created_at: new Date(),
      items_count: items.length
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(401).json({ error: 'Failed to create order' });
  }
});

app.listen(3000, () => {
  console.log('http://localhost:3000/cars');
  console.log('http://localhost:3000/spares');
  console.log('http://localhost:3000/auth - POST /login, POST /signup, GET /verify');
});

// POST /orders/:orderId/cancel - cancel an order (only by owner, only if pending)
app.post('/orders/:orderId/cancel', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { orderId } = req.params;

    // Fetch order
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = rows[0];
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }

    // Update status to cancelled
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', orderId]);

    res.json({ success: true, id: orderId, status: 'cancelled' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(401).json({ error: 'Failed to cancel order' });
  }
});

// Bookings: when a client books a mechanic
app.post('/bookings', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { mechanic_id, clientName, contact, carModel, year, description, location, scheduled_at } = req.body;

    if (!mechanic_id || !clientName || !contact || !carModel || !year || !description || !location) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    // Ensure bookings table exists
    const createSql = `
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mechanic_id INT NOT NULL,
        client_name VARCHAR(255),
        contact VARCHAR(255),
        car_model VARCHAR(255),
        year INT,
        description TEXT,
        location VARCHAR(255),
        scheduled_at DATETIME NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;
    await pool.query(createSql);

    const insertSql = `INSERT INTO bookings (user_id, mechanic_id, client_name, contact, car_model, year, description, location, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(insertSql, [userId, mechanic_id, clientName, contact, carModel, year, description, location, scheduled_at || null]);

    res.status(201).json({ id: result.insertId, status: 'pending' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(401).json({ error: 'Failed to create booking' });
  }
});

// GET /bookings - get bookings for logged-in user
app.get('/bookings', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const [rows] = await pool.query('SELECT b.*, u.fullname as mechanic_name FROM bookings b LEFT JOIN users u ON b.mechanic_id = u.id WHERE b.user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(401).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /bookings/mechanic - get bookings assigned to mechanic (requires mechanic to be logged in)
app.get('/bookings/mechanic', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const mechId = decoded.id;
    const [rows] = await pool.query('SELECT b.*, u.fullname as client_name FROM bookings b LEFT JOIN users u ON b.user_id = u.id WHERE b.mechanic_id = ? ORDER BY created_at DESC', [mechId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching mechanic bookings:', error);
    res.status(401).json({ error: 'Failed to fetch bookings for mechanic' });
  }
});

// PUT /bookings/:id/status - update booking status (accept/reject) - mechanic only
app.put('/bookings/:id/status', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status required' });

    // Verify booking exists and mechanic_id matches userId
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = rows[0];
    if (booking.mechanic_id !== userId) return res.status(403).json({ error: 'Not authorized to update this booking' });

    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, id, status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(401).json({ error: 'Failed to update booking' });
  }
});

// Bookings endpoints
// Create bookings table if missing and create a booking (user -> mechanic)
app.post('/bookings', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { mechanic_id, clientName, contact, carModel, year, description, location } = req.body;
    if (!clientName || !contact || !carModel || !year || !description || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const createSql = `
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        mechanic_id INT,
        client_name VARCHAR(255),
        contact VARCHAR(255),
        car_model VARCHAR(255),
        year INT,
        description TEXT,
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;
    await pool.query(createSql);

    const insertSql = `INSERT INTO bookings (user_id, mechanic_id, client_name, contact, car_model, year, description, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(insertSql, [userId, mechanic_id || null, clientName, contact, carModel, year, description, location, 'pending']);

    res.status(201).json({ id: result.insertId, status: 'pending' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(401).json({ error: 'Failed to create booking' });
  }
});

// Get bookings for logged-in user
app.get('/bookings', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const sql = `SELECT b.*, u.fullname as mechanic_name FROM bookings b LEFT JOIN users u ON b.mechanic_id = u.id WHERE b.user_id = ? ORDER BY b.created_at DESC`;
    const [rows] = await pool.query(sql, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(401).json({ error: 'Failed to fetch bookings' });
  }
});

// User cancels a booking (only owner, only when pending)
app.post('/bookings/:id/cancel', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const bookingId = req.params.id;

    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [bookingId, userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = rows[0];
    if (booking.status !== 'pending') return res.status(400).json({ error: 'Only pending bookings can be cancelled' });

    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);
    res.json({ success: true, id: bookingId, status: 'cancelled' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(401).json({ error: 'Failed to cancel booking' });
  }
});

// Mechanic (or admin) updates booking status (accept/reject)
app.put('/bookings/:id/status', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;
    const bookingId = req.params.id;
    const { status } = req.body; // expected 'accepted' or 'rejected'

    if (!status || !['accepted', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

    // Only allow mechanics assigned to the booking or admins to change status
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = rows[0];

    if (userRole !== 'admin' && booking.mechanic_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to change this booking' });
    }

    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId]);
    res.json({ success: true, id: bookingId, status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(401).json({ error: 'Failed to update booking status' });
  }
});