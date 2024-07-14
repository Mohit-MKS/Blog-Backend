import { NextFunction } from "express"
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces"


const notFound = (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  res.status(404).json({ code: 404, status: false, message: "Api Not Found" })
}

export { notFound }