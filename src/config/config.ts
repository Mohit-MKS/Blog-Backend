
import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve("env", `${process.env.NODE_ENV}.env`);

dotenv.config({ path: envFilePath });

const { PORT, MONGOURL, JWT_SECRET, SENDER_EMAIL, SENDER_PASSWORD } = process.env


export default { PORT, MONGOURL, JWT_SECRET, SENDER_EMAIL, SENDER_PASSWORD }