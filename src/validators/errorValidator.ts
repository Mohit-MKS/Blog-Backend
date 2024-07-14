import { validationResult } from "express-validator";

import { NextFunction } from "express";
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces";

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