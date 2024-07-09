
import dotenv from 'dotenv';
import path from 'path';
import { IEvironment } from '../models/interfaces/common.interfaces';

const envFilePath = path.resolve("env", `${process.env.NODE_ENV}.env`);

dotenv.config({ path: envFilePath });

const { PORT, MONGO_URL, MONGO_PASSWORD, JWT_SECRET, SENDER_EMAIL, SENDER_PASSWORD } = process.env as unknown as IEvironment


export default { PORT, MONGO_URL, MONGO_PASSWORD, JWT_SECRET, SENDER_EMAIL, SENDER_PASSWORD }