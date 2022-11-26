import { Exclude, Expose } from 'class-transformer';

export class BarbersSerializer {
  @Exclude()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
    coutry: string;
  };

  @Expose()
  photos: string[];

  @Expose()
  image: string;

  @Exclude()
  password: string;

  @Expose()
  workdays: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };

  @Expose()
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

  @Expose()
  geoLocation: {
    type: string;
    coordinates: [number, number];
  };

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose({ name: 'image_url' })
  getimage_url(): string | null {
    if (!this.image) {
      return 'https://app-agendabarber2.s3.amazonaws.com/imagem_2022-10-21_141207333.png';
    }
    return `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${this.image}`;
  }

  @Expose({ name: 'photos_url' })
  getphotos_url(): string[] {
    if (!this.photos) {
      return [];
    }
    return this.photos.map(
      (photo) => `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${photo}`,
    );
  }
}
