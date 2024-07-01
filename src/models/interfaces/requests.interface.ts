import { Request } from "express";
import { IUser } from "./user.interface";

interface ApiRequest extends Request {
  user?: Partial<IUser>
}

export { ApiRequest }