import { config } from "dotenv";

config({ path: `.env` });

export const { PORT, MONGODB_URL, CLOUDINARY_API, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } = process.env;