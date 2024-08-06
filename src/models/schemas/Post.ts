import { model, Schema, Types } from "mongoose";
import { Constants } from "../../services/constantService";
import { IPost } from "../interfaces/post.interface";

const postSchema = new Schema({
  title: { type: String, required: true },
  desc: String,
  file: { type: Types.ObjectId, ref: Constants.CollectionNames.File, required: true },
  category: { type: Types.ObjectId, ref: Constants.CollectionNames.Category, required: true },
  updatedBy: { type: Types.ObjectId, ref: Constants.CollectionNames.User, required: true }
}, {
  timestamps: true
})

const Post = model<IPost>(Constants.CollectionNames.Post, postSchema);

export { Post }