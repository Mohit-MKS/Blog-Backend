import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Constants } from '../../../common/constants/app.constants';
import { File } from '../../file/schemas/file.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: Constants.CollectionNames.User, timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, minlength: 6 })
  password: string;

  @Prop({ type: Number, default: 3 })
  role: number;

  @Prop({ type: Types.ObjectId, ref: Constants.CollectionNames.File })
  profilePic?: Types.ObjectId | File;

  @Prop({ type: String, default: null })
  userPic?: string | null;

  @Prop({ type: String, default: null })
  verificationCode?: string | null;

  @Prop({ type: String, default: null })
  forgotPasswordCode?: string | null;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
