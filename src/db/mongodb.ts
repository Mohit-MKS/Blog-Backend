import mongoose from "mongoose";
import config from "../config/config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGOURL as string);
    console.log('Database Connected Successfully');
  } catch (error: any) {
    console.log(error.message);
  }
}

export default { connectDB };