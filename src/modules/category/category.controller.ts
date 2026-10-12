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
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CategoryParamDto,
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload, UserRole } from '../../common/constants/app.constants';

@Controller('category')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCategories(@Query() query: QueryCategoryDto) {
    return this.categoryService.getCategories(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addCategory(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.addCategory(user._id, dto);
  }

  @Put(':categoryId')
  @HttpCode(HttpStatus.CREATED)
  updateCategory(
    @CurrentUser() user: JwtPayload,
    @Param() params: CategoryParamDto,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(
      user._id,
      params.categoryId,
      dto,
    );
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.CREATED)
  deleteCategory(@Param() params: CategoryParamDto) {
    return this.categoryService.deleteCategory(params.categoryId);
  }

  @Get(':categoryId')
  @HttpCode(HttpStatus.OK)
  getCategory(@Param() params: CategoryParamDto) {
    return this.categoryService.getCategory(params.categoryId);
  }
}
