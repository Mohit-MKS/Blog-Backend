import mongoose from "mongoose";
import { Constants } from "../../services/constantService";
import { IFile } from "../interfaces/common.interfaces";

const fileSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  otherMetadata: { type: String },
}, { timestamps: true });

const File = mongoose.model<IFile>(Constants.CollectionNames.File, fileSchema);

export { File }