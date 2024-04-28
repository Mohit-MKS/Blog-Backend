
import dotenv from 'dotenv';
dotenv.config();

const { PORT, MONGOURL, JWT_SECRET, SENDER_EMAIL, SENDER_PASSWORD } = process.env


export default { PORT, MONGOURL, JWT_SECRET, SENDER_EMAIL, SENDER_PASSWORD }