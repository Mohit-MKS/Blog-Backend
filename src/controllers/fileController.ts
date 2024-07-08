import { NextFunction } from "express";
import { ApiRequest } from "../models/interfaces/requests.interface";
import { ApiResponse } from "../models/interfaces/response.interface";


const uploadFile = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    res.json({ ok: true })

  } catch (error) {
    next(error)
  }
}

export default { uploadFile }