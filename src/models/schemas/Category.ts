import mongoose from "mongoose";
import { Constants } from "../../services/constantService";

const CategorySchema = mongoose.model(Constants.CollectionNames.Category, new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  desc: String,
  updatedBy: { type: mongoose.Types.ObjectId, ref: 'user', required: true },

}, { timestamps: true }))


export { CategorySchema }