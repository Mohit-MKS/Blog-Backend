import { ApiRequest } from "../models/interfaces/requests.interface";
import { ApiResponse } from "../models/interfaces/response.interface";
import { CategorySchema } from "../models/schemas/Category";
import { UserSchema } from "../models/schemas/User";
import { IUser } from "../models/interfaces/user.interface";
import { NextFunction } from "express";



const addCategory = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { title, desc } = req.body;
    const { _id } = req.user as IUser

    const isCategory = await CategorySchema.findOne({ title });
    if (isCategory) {
      res.code = 400;
      throw new Error("Category already exist");
    }

    const user = await UserSchema.findById(_id);
    if (!user) {
      res.code = 400;
      throw new Error("User not found");
    }

    const newCategory = new CategorySchema({ title, desc, updatedBy: _id })
    await newCategory.save();
    res.status(201).json({ code: 200, status: true, message: "Category created successfully" })

  } catch (error) {
    next(error)
  }

}


export default { addCategory }
