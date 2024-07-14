import { NextFunction } from "express";
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces";


const uploadFile = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    res.json({ ok: true })

  } catch (error) {
    next(error)
  }
}

export default { uploadFile }