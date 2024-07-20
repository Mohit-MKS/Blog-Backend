import { ObjectId } from "mongoose";

interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: number;
  profilePic?: { data: Buffer, contentType: string };
  userPic: string | null;
  verificationCode: string | null;
  forgotPasswordCode: string | null;
  isVerified: boolean
}

export { IUser }