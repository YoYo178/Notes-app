import { log } from "@src/util/logUtils";
import mongoose from "mongoose";


export async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI
        if (!mongoURI) {
            log("error", "MongoDB", null, "MONGODB_URI is not defined in the .env file!")
            return;
        }

        await mongoose.connect(mongoURI)
    } catch (error) {
        log("error", "MongoDB", error, "An error occured while connecting to MongoDB! More details below:")
    }
}