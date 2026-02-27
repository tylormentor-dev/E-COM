import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'supersecretkey';

/* ===========================
   REGISTER
=========================== */
app.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [full_name, email, hashedPassword, role]
    );

    res.json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/* ===========================
   LOGIN
=========================== */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/* ===========================
   AUTH MIDDLEWARE
=========================== */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/* ===========================
   CREATE BOOKING (CLIENT)
=========================== */
app.post('/bookings', authenticateToken, async (req, res) => {
  try {
    const { clientName, contact, carModel, year, description, scheduled_at } = req.body;

    if (!clientName || !contact || !carModel || !year || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = req.user.id;

    await pool.query(
      `INSERT INTO bookings 
       (user_id, client_name, contact, car_model, year, description, scheduled_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, clientName, contact, carModel, year, description, scheduled_at]
    );

    res.json({ message: 'Booking created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

/* ===========================
   GET ALL BOOKINGS (MECHANICS SEE ALL)
=========================== */
app.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, u.full_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.id DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/* ===========================
   UPDATE BOOKING STATUS
=========================== */
app.post('/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    await pool.query(
      `UPDATE bookings SET status = ? WHERE id = ?`,
      [status, bookingId]
    );

    res.json({ message: 'Status updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Status update failed' });
  }
});

/* ===========================
   START SERVER
=========================== */
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});