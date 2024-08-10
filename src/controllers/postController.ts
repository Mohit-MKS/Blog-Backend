import { NextFunction } from "express"
import { ApiRequest, ApiResponse, IFile } from "../models/interfaces/common.interfaces"
import { IUser } from "../models/interfaces/user.interface";
import { Post } from "../models/schemas/Post";
import { Category } from "../models/schemas/Category";
import { PipelineStage } from "mongoose";
import { File } from "../models/schemas/File";


const addPost = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { title, desc, category } = req.body;
    const { _id } = req.user as IUser;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      res.code = 404;
      throw new Error("Category not found");
    }
    let file: IFile | undefined
    if (req.file) {
      file = await File.create({ data: req.file.buffer, contentType: req.file.mimetype })
    }

    await Post.create({ title, desc, file: file?._id, category, updatedBy: _id });
    res.status(201).json({ code: 201, status: true, message: "Post added successfully" });
    /* empty */

  } catch (error) {
    next(error)
  }

}

const getPosts = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { search, pageSize, pageIndex } = req.query;
    const pagesize = Number(pageSize) || 10;
    const pageindex = Number(pageIndex) || 1;
    const start = pagesize * (pageindex - 1);
    let searchQuery = {} as PipelineStage;
    if (search) {
      const regex = new RegExp(search as string, 'i')
      searchQuery = { $match: { $or: [{ title: regex }, { desc: regex }] } }
    }
    const aggregationQuery: PipelineStage[] = [
      ...(search ? [searchQuery] : []),
      {
        $facet: {
          posts: [
            { $skip: start },
            { $limit: pagesize }
          ],
          pagination: [
            { $count: 'total' }
          ]
        }
      }
    ]
    console.log(aggregationQuery);


    const result = await Post.aggregate(aggregationQuery)

    const data = {
      posts: result[0].posts,
      pagination: result[0].pagination[0]
    }
    res.status(200).json({ code: 200, status: true, message: "Posts fetched successfully", data })

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

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      res.code = 404;
      throw new Error("Category not found")
    }

    if (req.file) {
      existingPost.file = req.file
    }

    existingPost.title = title || existingPost.title;
    existingPost.category = category || existingPost.category
    existingPost.desc = desc
    existingPost.updatedBy = _id;

    await existingPost.save();
    res.status(200).json({ code: 200, status: true, message: "Post updated successfully" })

  } catch (error) {
    next(error)
  }
}

const getPostDetails = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('updatedBy', '-password -isVerified').populate('category');

    if (!post) {
      res.code = 404;
      throw new Error("Post not found");
    }
    res.status(200).json({ code: 200, status: true, message: "Get post successful", data: { post } })

  } catch (error) {
    next(error)

  }
}

const deletePost = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.deleteOne({ _id: postId });
    if (deletedPost.deletedCount) {
      res.status(201).json({ code: 200, status: true, message: "Post deleted successfully" })
    }
    else {
      res.code = 400;
      throw new Error("Something went wrong")
    }

  } catch (error) {
    next(error)
  }
}

export default { addPost, getPosts, getPostDetails, updatePost, deletePost }