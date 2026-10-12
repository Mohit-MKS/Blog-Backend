import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Constants } from '../../../common/constants/app.constants';
import { User } from '../../auth/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: Constants.CollectionNames.Category, timestamps: true })
export class Category {
  _id: Types.ObjectId;

  @Prop({ type: String, unique: true, required: true, trim: true })
  title: string;

  @Prop({ type: String })
  desc: string;

  @Prop({
    type: Types.ObjectId,
    ref: Constants.CollectionNames.User,
    required: true,
  })
  updatedBy: Types.ObjectId | User;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
