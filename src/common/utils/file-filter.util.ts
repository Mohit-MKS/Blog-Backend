import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { Constants } from '../constants/app.constants';

export const multerFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if ((Constants.AllowedFileTypes as readonly string[]).includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Invalid file format'), false);
  }
};
