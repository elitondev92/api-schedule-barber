import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Barber } from '../../barbers/entities/barber.entity';

export type StylistDocument = Stylist & Document;

@Schema({ autoIndex: true })
export class Stylist {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Barber' })
  barber: Barber;

  @Prop({ required: true })
  name: string;

  @Prop()
  bio: string;

  @Prop()
  photo: string;

  @Prop()
  dateofinitiation: Date;

  @Prop()
  rate: number;

  @Prop()
  countofreviews: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StylistSchema = SchemaFactory.createForClass(Stylist);
