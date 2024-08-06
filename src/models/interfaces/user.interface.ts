import { ObjectId, Types } from "mongoose";
import { IFile } from "./common.interfaces";

interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: number;
  profilePic?: Types.ObjectId | IFile;
  userPic: string | null;
  verificationCode: string | null;
  forgotPasswordCode: string | null;
  isVerified: boolean
}

export { IUser }