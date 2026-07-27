import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_NAME, CLOUDINARY_API, CLOUDINARY_API_SECRET } from './config.js';

// Delete CLOUDINARY_URL if present in environment to prevent Cloudinary SDK from prioritizing stale/invalid URL
delete process.env.CLOUDINARY_URL;

const cloud_name = (CLOUDINARY_NAME || '').trim().replace(/^["']|["']$/g, '');
const api_key = (CLOUDINARY_API || '').trim().replace(/^["']|["']$/g, '');
const api_secret = (CLOUDINARY_API_SECRET || '').trim().replace(/^["']|["']$/g, '');

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

console.log('Cloudinary Config Status:', {
  cloud_name: cloud_name ? `${cloud_name.slice(0, 3)}***` : 'MISSING',
  api_key: api_key ? `${api_key.slice(0, 3)}***` : 'MISSING',
  api_secret: api_secret ? 'PRESENT' : 'MISSING',
});

export default cloudinary;




