import { Category } from "../models/schemas/Category";
import { User } from "../models/schemas/User";
import { IUser } from "../models/interfaces/user.interface";
import { NextFunction } from "express";
import { PipelineStage } from "mongoose";
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces";



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

    res.status(201).json({ code: 200, status: true, message: "Category updated successfully", data: { category: existingCategory } })

  } catch (error) {
    next(error)
  }

}

const getCategories = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
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
      searchQuery,
      {
        $facet: {
          categories: [
            { $skip: start },
            { $limit: pagesize }
          ],
          pagination: [
            { $count: 'total' }
          ]
        }
      }
    ]

    const result = await Category.aggregate(aggregationQuery)
    const data = {
      categories: result[0].categories,
      pagination: result[0].pagination[0]
    }
    res.status(200).json({ code: 200, status: true, message: "Categories fetched successfully", data })

  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { categoryId } = req.params
    const deletedCategory = await Category.deleteOne({ _id: categoryId });
    if (deletedCategory.deletedCount) {
      res.status(201).json({ code: 200, status: true, message: "Category deleted successfully" })
    }
    else {
      res.code = 400;
      throw new Error("Something went wrong")
    }

  } catch (error) {
    next(error)

  }
}

const getCategory = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      res.code = 404;
      throw new Error("Category not found")
    }

    res.status(200).json({ code: 200, status: true, message: "Get category successfully", data: { category } })

  } catch (error) {
    next(error)
  }
}


export default { addCategory, updateCategory, deleteCategory, getCategories, getCategory }
