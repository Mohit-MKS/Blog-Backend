import { Types } from "mongoose"

interface IPost {
  title: string
  desc: string,
  file: { data: Buffer, contentType: string },
  category: Types.ObjectId,
  updatedBy: Types.ObjectId,
}

export { IPost }