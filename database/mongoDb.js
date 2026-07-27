import mongoose from "mongoose";

const connectDB = async () => {
    const mongodbUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
    if (!mongodbUrl) {
        console.error("CRITICAL ERROR: No MongoDB URL found in environment variables (MONGODB_URL or MONGODB_URI)");
        return;
    }

    try {
        await mongoose.connect(mongodbUrl);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;