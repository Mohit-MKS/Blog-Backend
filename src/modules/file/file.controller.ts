import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { multerFileFilter } from '../../common/utils/file-filter.util';

@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: multerFileFilter,
      limits: { fileSize: 1024 * 1024 * 1024 },
    }),
  )
  uploadFile(@UploadedFile() file?: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }
}
