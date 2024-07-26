import { NextFunction } from "express"
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces"
import { IUser } from "../models/interfaces/user.interface";
import { Post } from "../models/schemas/Post";
import { Category } from "../models/schemas/Category";


const addPost = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { title, desc, category } = req.body;
    const { _id } = req.user as IUser;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      res.code = 404;
      throw new Error("Category not found");
    }

    let fileData;
    if (req.file) {
      fileData = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await Post.create({ title, desc, file: fileData, category, updatedBy: _id });
    res.status(201).json({ code: 201, status: true, message: "Post added successfully" });
    /* empty */

  } catch (error) {
    next(error)
  }

}

export default { addPost }