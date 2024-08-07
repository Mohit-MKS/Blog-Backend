import jwt, { Secret } from "jsonwebtoken";
import config from "../config/config";
import { NextFunction } from "express";
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces";
import { IUser } from "../models/interfaces/user.interface";

const isAuth = (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization ? req.headers.authorization.split(' ') : [];
    const token = authorization.length > 1 ? authorization[1] : null;

    if (token) {
      const payload = jwt.verify(token, config.JWT_SECRET as Secret) as IUser;
      if (payload) {
        req.user = {
          _id: payload._id,
          role: payload.role,
          name: payload.name,
          email: payload.email
        }
        next();
      } else {
        res.code = 401;
        throw new Error("Unauthorized");
      }

    }
    else {
      res.code = 400;
      throw new Error("Token is required")
    }

  } catch (error) {
    next(error)

  }
}

const isAdmin = (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    if (req.user && (req.user.role === 1 || req.user.role === 2)) {
      next();
    }
    else {
      res.code = 401;
      throw new Error("Permission denied");
    }

  } catch (error) {
    next(error);

  }
}

export { isAuth, isAdmin }