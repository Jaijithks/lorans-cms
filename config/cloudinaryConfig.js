import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const cloud_name = (process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const api_key = (process.env.CLOUDINARY_API || process.env.CLOUDINARY_API_KEY || '').trim();
const api_secret = (process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET || '').trim();

if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
}

console.log('Cloudinary initialized:', {
  cloud_name,
  api_key: api_key ? `${api_key.substring(0, 4)}***` : 'MISSING',
  has_secret: !!api_secret,
});

export default cloudinary;
