import { config } from "dotenv";

config({ path: `.env` });

const cleanEnv = (val) => (val || '').trim().replace(/^["']|["']$/g, '');

export const PORT = process.env.PORT || 5500;
export const MONGODB_URL = process.env.MONGODB_URL;

export const CLOUDINARY_NAME = cleanEnv(process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME);
export const CLOUDINARY_API = cleanEnv(process.env.CLOUDINARY_API || process.env.CLOUDINARY_API_KEY);
export const CLOUDINARY_API_SECRET = cleanEnv(process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET);