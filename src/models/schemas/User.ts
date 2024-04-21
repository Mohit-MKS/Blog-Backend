import mongoose from "mongoose";
import { Constants } from "../../services/constantService";

const userSchema = mongoose.model(Constants.CollectionNames.User, new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: Number, default: 3 }
}, { timestamps: true }))

// Role: 1-Super Admin, 2-Admin, 3-Normal User

export default { userSchema }