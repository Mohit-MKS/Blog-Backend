import { ObjectId } from "mongoose"

interface IPost {
  title: string
  desc: string,
  file: { buffer: Buffer, mimetype: string } | undefined,
  category: ObjectId,
  updatedBy: ObjectId,
}

export { IPost }