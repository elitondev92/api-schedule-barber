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
  geoLocation: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
  image_url: string;
}
