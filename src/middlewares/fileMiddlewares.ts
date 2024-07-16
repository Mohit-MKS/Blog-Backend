import multer, { FileFilterCallback } from "multer";
import path from "path";
import { generateCode } from "../services/authService";
import { Constants } from "../services/constantService";
import { GridFsStorage } from "multer-gridfs-storage";
import config from "../config/config";
import { Request } from "express";

// const storage = new GridFsStorage({
//   url: config.MONGO_CONNECTION_URL,
//   cache: true,
//   options: { useUnifiedTopology: true },
//   file: (req, file) => {
//     const oName = file.originalname;
//     const extension = path.extname(oName);
//     const fName = oName.replace(extension, '');
//     const fNameFormated = fName.split(' ').join('_').toLocaleLowerCase();
//     const code = generateCode(12);
//     const fNameToSave = `${fNameFormated}_${code}${extension}`;
//     const fileObj = {
//       fileName: fNameToSave,
//       bucketName: 'files'
//     };
//     return fileObj
//   }
// });

// const storage = multer.memoryStorage()

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  const mimetype = file.mimetype;
  if (Constants.AllowedFileTypes.includes(mimetype)) {
    callback(null, true)
  }
  else {
    callback(new Error("Invalid file format"))
  }
}

const upload = multer({
  fileFilter,
  limits: { fieldSize: 1024 * 1024 * 1024 },
})

export { upload }