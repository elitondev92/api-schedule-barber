import { Exclude, Expose } from 'class-transformer';

export class UsersSerializer {
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
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    coutry: string;
  };

  @Expose()
  image: string;

  @Exclude()
  password: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;

  @Expose()
  deleted: boolean;

  @Expose({ name: 'image_url' })
  getimage_url(): string | null {
    if (!this.image) {
      return 'https://app-agendabarber2.s3.amazonaws.com/imagem_2022-10-21_141207333.png';
    }
    return `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${this.image}`;
  }
}
