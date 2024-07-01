
import jwt, { Secret } from "jsonwebtoken";
import config from "../config/config";
import { IUser } from "../models/interfaces/user.interface";

const generateToken = (user: IUser) => {
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    config.JWT_SECRET as Secret,
    {
      expiresIn: '7d'
    }
  )
  return token;
}



const generateCode = (codeLength: number) => {
  const number = String(Math.random()).split(".")[1].slice(0, codeLength || 4);
  return number;
}


export { generateToken, generateCode }
