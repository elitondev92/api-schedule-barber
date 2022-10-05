import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberSchema } from './barbers.model';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import * as bcrypt from 'bcrypt';

@Module({
  exports: [BarbersService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Barber.name,
        useFactory: () => {
          const schema = BarberSchema;
          schema.pre('save', async function () {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(this.password, salt);
            this.password = hashPassword;
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
