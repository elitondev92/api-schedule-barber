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

  @Prop()
  image: string;

  @Prop()
  phone: string;

  @Prop({ type: Object })
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
    coutry: string;
  };

  @Prop({ type: [{ type: String }], index: '2dsphere' })
  geoLocation: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BarberSchema = SchemaFactory.createForClass(Barber);
