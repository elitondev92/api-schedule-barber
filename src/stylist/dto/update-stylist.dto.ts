import { PartialType } from '@nestjs/mapped-types';
import { CreateStylistDto } from './create-stylist.dto';

export class UpdateStylistDto extends PartialType(CreateStylistDto) {
  name: string;
  bio: string;
  photo: string;
  dateofinitiation: Date;
  rate: number;
  countofreviews: number;
}
