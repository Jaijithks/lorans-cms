import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from './config.js';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;