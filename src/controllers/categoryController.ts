import { ApiRequest } from "../models/interfaces/requests.interface";
import { ApiResponse } from "../models/interfaces/response.interface";
import { Category } from "../models/schemas/Category";
import { User } from "../models/schemas/User";
import { IUser } from "../models/interfaces/user.interface";
import { NextFunction } from "express";



const addCategory = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { title, desc } = req.body;
    const { _id } = req.user as IUser

    const isCategory = await Category.findOne({ title });
    if (isCategory) {
      res.code = 400;
      throw new Error("Category already exist");
    }

    const user = await User.findById(_id);
    if (!user) {
      res.code = 400;
      throw new Error("User not found");
    }

    const newCategory = await Category.create({ title, desc, updatedBy: _id })
    res.status(201).json({ code: 200, status: true, message: "Category created successfully" })

  } catch (error) {
    next(error)
  }

}

const updateCategory = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { categoryId } = req.params
    const { title, desc } = req.body;
    const { _id } = req.user as IUser

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      res.code = 404;
      throw new Error("Category not found");
    }

    if (existingCategory && existingCategory.title === title && String(existingCategory._id) !== String(categoryId)) {
      res.code = 400;
      throw new Error("Title already exist");
    }
    existingCategory.title = title || existingCategory.title;
    existingCategory.desc = desc;
    existingCategory.updatedBy = _id;
    await existingCategory.save()

    res.status(201).json({ code: 200, status: true, message: "Category updated successfully" })

  } catch (error) {
    next(error)
  }

}


export default { addCategory, updateCategory }
