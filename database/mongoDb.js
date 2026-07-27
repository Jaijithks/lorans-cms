import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config.js";

const connectDB = async () => {
    if (!MONGODB_URL) {
        console.error("CRITICAL ERROR: MONGODB_URL is missing in environment variables");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;

