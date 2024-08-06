import { Request, Response } from "express";
import { IUser } from "./user.interface";
import { Types } from "mongoose";

interface ApiRequest extends Request {
  user?: Partial<IUser>
}


interface ApiResponse<T = TResponseJson> extends Response {
  code?: number;
  json: (body: T) => this
}

interface TResponseJson {
  code?: number;
  status?: boolean;
  message?: string;
  ok?: boolean;
  stack?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

interface IFile {
  _id: Types.ObjectId;
  data: Buffer,
  contentType: string
}


interface IEvironment {
  PORT: string,
  MONGO_URL: string,
  MONGO_PASSWORD: string,
  JWT_SECRET: string,
  SENDER_EMAIL: string,
  SENDER_PASSWORD: string
}


export { ApiRequest, ApiResponse, IFile, IEvironment }