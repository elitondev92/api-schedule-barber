import { PartialType } from '@nestjs/mapped-types';
import { CreateBarberDto } from './create-barber.dto';

export class UpdateBarberDto extends PartialType(CreateBarberDto) {}
