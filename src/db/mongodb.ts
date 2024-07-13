import mongoose from "mongoose";
import config from "../config/config";

let db: mongoose.Mongoose;

const connectDB = async () => {
  try {
    db = await mongoose.connect(config.MONGO_CONNECTION_URL);
    console.log('Database Connected Successfully');
  } catch (error: any) {
    console.log(error.message);
  }
}

const dbInstance = async () => {
  try {
    if (!db) {
      await connectDB();
    }
    return db;
  } catch (error: any) {
    console.log(error.message);
  }
}

export default { connectDB, dbInstance };