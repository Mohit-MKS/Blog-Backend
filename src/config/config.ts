
import dotenv from 'dotenv';
import path from 'path';
import { IEvironment } from '../models/interfaces/common.interfaces';
import { decrypt } from '../services/encryptionService';

const envFilePath = path.resolve("env", `${process.env.NODE_ENV}.env`);

dotenv.config({ path: envFilePath });

const env = process.env as unknown as IEvironment

const decryptedMongoUrl = decrypt(env.MONGO_URL)
const decryptedMongoPass = decrypt(env.MONGO_PASSWORD)
const MONGO_CONNECTION_URL = `mongodb+srv://${decryptedMongoPass}@${decryptedMongoUrl}/blog?retryWrites=true&w=majority&appName=blogApi`

const config = {
  PORT: env.PORT,
  MONGO_CONNECTION_URL,
  JWT_SECRET: env.JWT_SECRET,
  SENDER_EMAIL: env.SENDER_EMAIL,
  SENDER_PASSWORD: env.SENDER_PASSWORD
}


export default config