import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDto } from './create-work.dto';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {
  name: string;
  description: string;
  duration: number;
  price: number;
  recurrence: number;
  image: string;
}
