import { ObjectId } from "mongoose";

interface ICategory {
  title: string;
  desc: string;
  updatedBy: ObjectId
}

export type { ICategory }