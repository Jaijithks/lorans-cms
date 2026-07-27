import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_NAME, CLOUDINARY_API, CLOUDINARY_API_SECRET } from './config.js';

const cloud_name = (CLOUDINARY_NAME || '').trim();
const api_key = (CLOUDINARY_API || '').trim();
const api_secret = (CLOUDINARY_API_SECRET || '').trim();

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

export default cloudinary;



