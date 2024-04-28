
import dotenv from 'dotenv';
dotenv.config();

const { PORT, MONGOURL, JWT_SECRET } = process.env


export default { PORT, MONGOURL, JWT_SECRET }