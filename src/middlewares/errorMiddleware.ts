import { NextFunction } from "express";
import { ApiRequest } from "../models/interfaces/requests.interface";
import { ApiResponse } from "../models/interfaces/response.interface";

const errorHandler = (error: Error, req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  const code = res.code ? res.code : 500;
  res.status(code).json({ code, status: false, message: error.message, stack: error.stack })
}

export { errorHandler }