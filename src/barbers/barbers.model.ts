import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BarberDocument = Barber & Document;

@Schema()
export class Barber {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
}

export const BarberSchema = SchemaFactory.createForClass(Barber);
