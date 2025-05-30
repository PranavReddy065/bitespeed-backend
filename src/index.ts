import express from 'express';
import dotenv from 'dotenv';
import pool from './db';
import contactRoutes from './routes/contact';  

dotenv.config();

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Failed to connect to PostgreSQL:', err));

const app = express();

app.use(express.json());

app.use('/api', contactRoutes);

app.get('/', (_req, res) => {
  res.send('Bitespeed Backend is running!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});