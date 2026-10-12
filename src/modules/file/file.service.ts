import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
  ) {}

  async uploadFile(file?: Express.Multer.File) {
    if (!file) {
      return { ok: true };
    }

    const savedFile = await this.fileModel.create({
      data: file.buffer,
      contentType: file.mimetype,
      otherMetadata: file.originalname,
    });

    return {
      ok: true,
      fileId: savedFile._id,
    };
  }

  async getFileById(fileId: string) {
    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new BadRequestException('File not found');
    }
    return file;
  }
}
