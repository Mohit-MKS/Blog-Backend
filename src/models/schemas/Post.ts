import { model, Schema, Types } from "mongoose";
import { Constants } from "../../services/constantService";

const postSchema = new Schema({
  title: { type: String, required: true },
  desc: String,
  file: { data: Buffer, contentType: String },
  category: { type: Types.ObjectId, ref: Constants.CollectionNames.Category, required: true },
  updatedBy: { type: Types.ObjectId, ref: Constants.CollectionNames.User, required: true }
}, {
  timestamps: true
})

const Post = model(Constants.CollectionNames.Post, postSchema);

export { Post }