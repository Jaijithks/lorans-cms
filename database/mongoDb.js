import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config.js";

if (!MONGODB_URL) {
    throw new error("no monogodb url found")
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("connected to mongoDB")
    } catch (error) {
        console.error(error)
    }
}

export default connectDB;