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

// Connect Database
connectDB();

// Robust CORS Middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://lorans.vercel.app',
    'https://lorans-cms-frontend.vercel.app',
    'https://www.loransmakeupstudio.com',
    'https://loransmakeupstudio.com'
  ];
  const origin = req.headers.origin;

  if (origin) {
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin) || /\.vercel\.app$/.test(cleanOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.originalUrl);
  next();
});

app.use('/api', galleryRoutes);

app.get('/', (req, res) => {
  res.send('CMS Backend API is running');
});

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
