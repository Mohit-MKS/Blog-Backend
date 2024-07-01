import { validationResult } from "express-validator";
import { ApiRequest } from "../models/interfaces/requests.interface";
import { ApiResponse } from "../models/interfaces/response.interface";
import { NextFunction } from "express";

const validateErrors = (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  const errors = validationResult(req);
  const errorsObj: any = {}
  if (errors.isEmpty())
    return next();


  errors.array().map((error: any) => {
    if (!errorsObj[error.path])
      errorsObj[error.path] = error.msg;
  })

  return res.status(400).json({ message: errorsObj })
}

export { validateErrors }