import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import {
  CreatePostDto,
  PostParamDto,
  QueryPostDto,
  UpdatePostDto,
} from './dto/post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/constants/app.constants';
import { multerFileFilter } from '../../common/utils/file-filter.util';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: multerFileFilter,
      limits: { fileSize: 1024 * 1024 * 1024 },
    }),
  )
  addPost(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.addPost(user._id, dto, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getPosts(@Query() query: QueryPostDto) {
    return this.postService.getPosts(query);
  }

  @Get(':postId')
  @HttpCode(HttpStatus.OK)
  getPostDetails(@Param() params: PostParamDto) {
    return this.postService.getPostDetails(params.postId);
  }

  @Put(':postId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: multerFileFilter,
      limits: { fileSize: 1024 * 1024 * 1024 },
    }),
  )
  updatePost(
    @CurrentUser() user: JwtPayload,
    @Param() params: PostParamDto,
    @Body() dto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.updatePost(user._id, params.postId, dto, file);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.CREATED)
  deletePost(@Param() params: PostParamDto) {
    return this.postService.deletePost(params.postId);
  }
}
