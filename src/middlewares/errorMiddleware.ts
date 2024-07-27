import { NextFunction } from "express";
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: Error, req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  const code = res.code ? res.code : 500;
  res.status(code).json({ code, status: false, message: error.message, stack: error.stack })
}

export { errorHandler }