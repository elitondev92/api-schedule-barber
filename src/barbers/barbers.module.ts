import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberSchema } from './barbers.model';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Barber.name, schema: BarberSchema }]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
