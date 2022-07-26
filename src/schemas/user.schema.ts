import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date } from 'mongoose';

export type UserDocument = User & Document;

export class PhoneAttributes {
  @Prop()
  number: string;

  @Prop()
  ddd: string;
}

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phones: PhoneAttributes[];

  @Prop({ type: Date, default: Date.now() })
  creationDate: Date;

  @Prop({ type: Date, default: Date.now() })
  updateDate: Date;

  @Prop({ type: Date, default: Date.now() })
  lastLogin: Date | string;

  @Prop()
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
