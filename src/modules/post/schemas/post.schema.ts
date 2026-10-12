import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Constants } from '../../../common/constants/app.constants';
import { File } from '../../file/schemas/file.schema';
import { Category } from '../../category/schemas/category.schema';
import { User } from '../../auth/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ collection: Constants.CollectionNames.Post, timestamps: true })
export class Post {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  desc: string;

  @Prop({
    type: Types.ObjectId,
    ref: Constants.CollectionNames.File,
    required: true,
  })
  file: Types.ObjectId | File;

  @Prop({
    type: Types.ObjectId,
    ref: Constants.CollectionNames.Category,
    required: true,
  })
  category: Types.ObjectId | Category;

  @Prop({
    type: Types.ObjectId,
    ref: Constants.CollectionNames.User,
    required: true,
  })
  updatedBy: Types.ObjectId | User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
