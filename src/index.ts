import express from 'express';
import dotenv from 'dotenv';
// Removed 'import pool from './db';' as Prisma handles database connections.
import contactRoutes from './routes/contact'; // Correct import for your 'contact.ts' router file

dotenv.config();

// Removed pool.connect() as Prisma handles database connections
// and this can conflict or be redundant.

const app = express();

app.use(express.json());

// Changed the mount point from '/api' to '/'
// This means that if 'contactRoutes' defines a route like '/identify',
// the final accessible endpoint will be '/identify'.
app.use('/', contactRoutes);

// A basic GET route for checking if the server is running.
app.get('/', (_req, res) => {
    res.send('Bitespeed Backend is running!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});