import mongoose from "mongoose";
import { Constants } from "../../services/constantService";
import { IUser } from "../interfaces/user.interface";

const User = mongoose.model<IUser>(Constants.CollectionNames.User, new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: Number, default: 3 },
  profilePic: { data: Buffer, contentType: String },
  userPic: String,
  verificationCode: String,
  forgotPasswordCode: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true }))

// Role: 1-Super Admin, 2-Admin, 3-Normal User

export { User }