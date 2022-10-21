import { Exclude, Expose } from 'class-transformer';

export class WorksSerializer {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  duration: number;

  @Expose()
  price: number;

  @Expose()
  recurrence: number;

  @Expose()
  image: string;

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
}
