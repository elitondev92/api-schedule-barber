import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Barber, BarberDocument } from './barbers.model';

@Injectable()
export class BarbersService {
  constructor(
    @InjectModel(Barber.name) private baberModel: Model<BarberDocument>,
  ) {}

  async findAll() {
    return this.baberModel.find().exec();
  }

  async findOne(email: string) {
    const barber = await this.baberModel.findOne({ email }).exec();
    if (!barber) {
      throw new Error('Barber not found');
    }
    return barber;
  }

  async create(createBarberDto: any) {
    const checkBarber = await this.baberModel
      .findOne({ email: createBarberDto.email })
      .exec();
    if (checkBarber) {
      throw new Error('Barbeiro já cadastrado');
    }
    const createdBarber = await new this.baberModel(createBarberDto).save();
    return createdBarber;
  }

  async remove(id: string) {
    return this.baberModel.findByIdAndDelete(id).exec();
  }
}
