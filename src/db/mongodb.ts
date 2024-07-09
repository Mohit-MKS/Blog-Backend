import mongoose from "mongoose";
import config from "../config/config";
import { decrypt } from "../services/encryptionService";

const connectDB = async () => {
  try {
    const decryptedMongoUrl = decrypt(config.MONGO_URL)
    const decryptedMongoPass = decrypt(config.MONGO_PASSWORD)
    const MONGOURL = `mongodb+srv://${decryptedMongoPass}@${decryptedMongoUrl}/blog?retryWrites=true&w=majority&appName=blogApi`
    await mongoose.connect(MONGOURL);
    console.log('Database Connected Successfully');
  } catch (error: any) {
    console.log(error.message);
  }
}

export default { connectDB };