import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Constants } from '../../../common/constants/app.constants';

export type FileDocument = HydratedDocument<File>;

@Schema({ collection: Constants.CollectionNames.File, timestamps: true })
export class File {
  _id: Types.ObjectId;

  @Prop({ type: Buffer, required: true })
  data: Buffer;

  @Prop({ type: String, required: true })
  contentType: string;

  @Prop({ type: String })
  otherMetadata?: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
