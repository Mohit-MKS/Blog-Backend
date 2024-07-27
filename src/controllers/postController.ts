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

const updatePost = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { postId } = req.params
    const { title, desc, category } = req.body
    const { _id } = req.user as IUser
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      res.code = 404;
      throw new Error("Post not found");
    }

    if (req.file) {
      existingPost.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    existingPost.title = title || existingPost.title;
    existingPost.category = category || existingPost.category
    existingPost.desc = desc || existingPost.desc
    existingPost.updatedBy = _id || existingPost.updatedBy;

    await existingPost.save();
    res.status(200).json({ code: 200, status: true, message: "Post updated successfully" })

  } catch (error) {
    next(error)
  }
}

export default { addPost, updatePost }