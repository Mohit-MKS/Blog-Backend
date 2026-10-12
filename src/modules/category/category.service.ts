import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async addCategory(userId: string, dto: CreateCategoryDto) {
    const isCategory = await this.categoryModel.findOne({ title: dto.title });
    if (isCategory) {
      throw new BadRequestException('Category already exist');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.categoryModel.create({
      title: dto.title,
      desc: dto.desc,
      updatedBy: userId,
    });

    return {
      code: 200,
      status: true,
      message: 'Category created successfully',
    };
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ) {
    const existingCategory = await this.categoryModel.findById(categoryId);
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (dto.title && dto.title !== existingCategory.title) {
      const duplicateTitle = await this.categoryModel.findOne({
        title: dto.title,
        _id: { $ne: categoryId },
      });
      if (duplicateTitle) {
        throw new BadRequestException('Title already exist');
      }
      existingCategory.title = dto.title;
    }

    if (dto.desc !== undefined) {
      existingCategory.desc = dto.desc;
    }
    existingCategory.updatedBy = new Types.ObjectId(userId);
    await existingCategory.save();

    return {
      code: 200,
      status: true,
      message: 'Category updated successfully',
      data: { category: existingCategory },
    };
  }

  async getCategories(queryDto: QueryCategoryDto) {
    const pagesize = Number(queryDto.pageSize) || 10;
    const pageindex = Number(queryDto.pageIndex) || 1;
    const start = pagesize * (pageindex - 1);

    const pipeline: PipelineStage[] = [];

    if (queryDto.search) {
      const regex = new RegExp(queryDto.search, 'i');
      pipeline.push({
        $match: { $or: [{ title: regex }, { desc: regex }] },
      });
    }

    pipeline.push({
      $facet: {
        categories: [{ $skip: start }, { $limit: pagesize }],
        pagination: [{ $count: 'total' }],
      },
    });

    const result = await this.categoryModel.aggregate(pipeline);
    const data = {
      categories: result[0]?.categories || [],
      pagination: result[0]?.pagination[0] || { total: 0 },
    };

    return {
      code: 200,
      status: true,
      message: 'Categories fetched successfully',
      data,
    };
  }

  async getCategory(categoryId: string) {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      code: 200,
      status: true,
      message: 'Get category successfully',
      data: { category },
    };
  }

  async deleteCategory(categoryId: string) {
    const deletedCategory = await this.categoryModel.deleteOne({
      _id: categoryId,
    });

    if (deletedCategory.deletedCount) {
      return {
        code: 200,
        status: true,
        message: 'Category deleted successfully',
      };
    }

    throw new BadRequestException('Something went wrong');
  }
}
