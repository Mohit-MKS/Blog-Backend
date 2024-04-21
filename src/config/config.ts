
import dotenv from 'dotenv';
dotenv.config();

const { PORT, MONGOURL } = process.env


export default { PORT, MONGOURL }