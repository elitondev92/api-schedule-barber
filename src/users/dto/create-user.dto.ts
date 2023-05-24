export class CreateUserDto {
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
  createAt: Date;
  image_url: string;
}
