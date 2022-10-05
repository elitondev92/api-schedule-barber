import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BarberDocument = Barber & Document;

@Schema({ autoIndex: true })
export class Barber {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  private _id: any;
}

export const BarberSchema = SchemaFactory.createForClass(Barber);
