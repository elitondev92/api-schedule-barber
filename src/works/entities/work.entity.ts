import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Barber } from '../../barbers/barbers.model';

export type WorkDocument = Work & Document;

@Schema({ autoIndex: true })
export class Work {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Barber' })
  barber: Barber;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const WorkSchema = SchemaFactory.createForClass(Work);
