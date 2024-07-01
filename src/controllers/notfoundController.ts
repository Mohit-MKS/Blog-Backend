import { NextFunction } from "express"
import { ApiRequest } from "../models/interfaces/requests.interface"
import { ApiResponse } from "../models/interfaces/response.interface"

const notFound = (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  res.status(404).json({ code: 404, status: false, message: "Api Not Found" })
}

export { notFound }