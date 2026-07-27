import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../database/mongoDb.js';
import galleryRoutes from '../routes/gallery.routes.js';
import { errorHandler } from '../middleware/errorHandler.js';
import dns from 'dns';

dotenv.config();

const app = express();

dns.setServers(['1.1.1.1', '8.8.8.8']);
const PORT = process.env.PORT || 5000;
connectDB();
app.use(express.json());
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.originalUrl);
  next();
});
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://lorans.vercel.app',
    'https://lorans-cms-frontend.vercel.app'
  ];
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use('/api', galleryRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error('========== GLOBAL ERROR ==========');
  console.error(err);
  if (err.stack) console.error(err.stack);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    error: err.name || 'Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});