import { Request, Response } from "express";
import { IUser } from "./user.interface";

interface ApiRequest extends Request {
  user?: Partial<IUser>
}



interface ApiResponse extends Response {
  code?: number;
}


interface IEvironment {
  PORT: string,
  MONGO_URL: string,
  MONGO_PASSWORD: string,
  JWT_SECRET: string,
  SENDER_EMAIL: string,
  SENDER_PASSWORD: string
}


export { ApiRequest, ApiResponse, IEvironment }