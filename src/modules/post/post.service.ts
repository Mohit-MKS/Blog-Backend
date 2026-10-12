import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import {
  Category,
  CategoryDocument,
} from '../category/schemas/category.schema';
import { File, FileDocument } from '../file/schemas/file.schema';
import {
  CreatePostDto,
  QueryPostDto,
  UpdatePostDto,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
  ) {}

  async addPost(
    userId: string,
    dto: CreatePostDto,
    file?: Express.Multer.File,
  ) {
    const existingCategory = await this.categoryModel.findById(dto.category);
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    let fileDoc: FileDocument | null = null;
    if (file) {
      fileDoc = await this.fileModel.create({
        data: file.buffer,
        contentType: file.mimetype,
      });
    }

    await this.postModel.create({
      title: dto.title,
      desc: dto.desc,
      file: fileDoc?._id,
      category: new Types.ObjectId(dto.category),
      updatedBy: new Types.ObjectId(userId),
    });

    return {
      code: 201,
      status: true,
      message: 'Post added successfully',
    };
  }

  async getPosts(queryDto: QueryPostDto) {
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
        posts: [{ $skip: start }, { $limit: pagesize }],
        pagination: [{ $count: 'total' }],
      },
    });

    const result = await this.postModel.aggregate(pipeline);
    const data = {
      posts: result[0]?.posts || [],
      pagination: result[0]?.pagination[0] || { total: 0 },
    };

    return {
      code: 200,
      status: true,
      message: 'Posts fetched successfully',
      data,
    };
  }

  async getPostDetails(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('updatedBy', '-password -isVerified')
      .populate('category');

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      code: 200,
      status: true,
      message: 'Get post successful',
      data: { post },
    };
  }

  async updatePost(
    userId: string,
    postId: string,
    dto: UpdatePostDto,
    file?: Express.Multer.File,
  ) {
    const existingPost = await this.postModel.findById(postId);
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    if (dto.category) {
      const existingCategory = await this.categoryModel.findById(dto.category);
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }
      existingPost.category = new Types.ObjectId(dto.category);
    }

    if (file) {
      const fileDoc = await this.fileModel.create({
        data: file.buffer,
        contentType: file.mimetype,
      });
      existingPost.file = fileDoc._id;
    }

    if (dto.title !== undefined) {
      existingPost.title = dto.title;
    }
    if (dto.desc !== undefined) {
      existingPost.desc = dto.desc;
    }
    existingPost.updatedBy = new Types.ObjectId(userId);

    await existingPost.save();

    return {
      code: 200,
      status: true,
      message: 'Post updated successfully',
    };
  }

  async deletePost(postId: string) {
    const deletedPost = await this.postModel.deleteOne({ _id: postId });
    if (deletedPost.deletedCount) {
      return {
        code: 200,
        status: true,
        message: 'Post deleted successfully',
      };
    }

    throw new BadRequestException('Something went wrong');
  }
}
