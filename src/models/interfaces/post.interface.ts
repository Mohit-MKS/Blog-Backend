import { ObjectId } from "mongoose"

interface IPost {
  title: string
  desc: string,
  file: { data: Buffer, contentType: string },
  category: ObjectId,
  updatedBy: ObjectId,
}

export { IPost }