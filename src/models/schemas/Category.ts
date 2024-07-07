import mongoose from "mongoose";
import { Constants } from "../../services/constantService";

const Category = mongoose.model(Constants.CollectionNames.Category, new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  desc: String,
  updatedBy: { type: mongoose.Types.ObjectId, ref: Constants.CollectionNames.User, required: true },

}, { timestamps: true }))


export { Category }