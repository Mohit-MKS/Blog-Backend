import mongoose from "mongoose";
import config from "../config/config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGOURL);
        console.log('Database Connected Successfully');


    } catch (error) {
        console.log(error.message);


    }
}

export default { connectDB };