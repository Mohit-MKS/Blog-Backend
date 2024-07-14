import mongoose from "mongoose";
import { Constants } from "../../services/constantService";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  otherMetadata: { type: String },
});

const File = mongoose.model(Constants.CollectionNames.File, fileSchema);