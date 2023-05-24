export class CreateBarberDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
    coutry: string;
  };
  photos: string[];
  geoLocation: {
    type: string;
    coordinates: [number, number];
  };
  workdays: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
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
  createdAt: Date;
  updatedAt: Date;
  image_url: string;
}
