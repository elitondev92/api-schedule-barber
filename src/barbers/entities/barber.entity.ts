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
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    coutry: string;
  };

  @Prop({ type: Array, length: 5 })
  photos: string[];

  @Prop({ type: Object })
  geoLocation: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({
    type: Object,
    default: {
      sunday: false,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
    },
  })
  workdays: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };

  @Prop({
    type: Object,
    default: {
      sunday: {
        start: '08:00',
        breakStart: '12:00',
        breakEnd: '14:00',
        end: '18:00',
      },
      monday: {
        start: '08:00',
        breakStart: '12:00',
        breakEnd: '14:00',
        end: '18:00',
      },
      tuesday: {
        start: '08:00',
        breakStart: '12:00',
        breakEnd: '14:00',
        end: '18:00',
      },
      wednesday: {
        start: '08:00',
        breakStart: '12:00',
        breakEnd: '14:00',
        end: '18:00',
      },
      thursday: {
        start: '08:00',
        breakStart: '12:00',
        breakEnd: '14:00',
        end: '18:00',
      },
      friday: {
        start: '08:00',
        breakStart: '12:00',
        breakEnd: '14:00',
        end: '18:00',
      },
      saturday: {
        start: '08:00',
        breakStart: '12:00',
        breakEnd: '14:00',
        end: '18:00',
      },
    },
  })
  workhours: {
    sunday: {
      start: string;
      breakStart: string;
      breakEnd: string;
      end: string;
    };
    monday: {
      start: string;
      breakStart: string;
      breakEnd: string;
      end: string;
    };
    tuesday: {
      start: string;
      breakStart: string;
      breakEnd: string;
      end: string;
    };
    wednesday: {
      start: string;
      breakStart: string;
      breakEnd: string;
      end: string;
    };
    thursday: {
      start: string;
      breakStart: string;
      breakEnd: string;
      end: string;
    };
    friday: {
      start: string;
      breakStart: string;
      breakEnd: string;
      end: string;
    };
    saturday: {
      start: string;
      breakStart: string;
      breakEnd: string;
      end: string;
    };
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BarberSchema = SchemaFactory.createForClass(Barber);
