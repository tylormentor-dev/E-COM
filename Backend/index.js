import express from 'express';
import cors from 'cors';
import pool from './db.js';


const app = express();   
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

app.listen(3000, () => {
  console.log('http://localhost:3000/cars');
  console.log('http://localhost:3000/spares');
});