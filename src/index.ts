import express from 'express';
import dotenv from 'dotenv';
import pool from './db';

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Failed to connect to PostgreSQL:', err));


dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('Bitespeed Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});