import multer from "multer";
import path from "path";
import { generateCode } from "../services/authService";
import { Constants } from "../services/constantService";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads')
  },
  filename: (req, file, callback) => {
    const oName = file.originalname;
    const extension = path.extname(oName);
    const fName = oName.replace(extension, '');
    const fNameFormated = fName.split(' ').join('_').toLocaleLowerCase();
    const code = generateCode(12);
    const fNameToSave = `${fNameFormated}_${code}${extension}`;
    callback(null, fNameToSave);
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    callback(null, true)
    const mimetype = file.mimetype;
    if (Constants.AllowedFileTypes.includes(mimetype)) {
      callback(null, true)
    }
    else {
      callback(new Error("Invalid file format"))
    }

  },
})

export { upload }