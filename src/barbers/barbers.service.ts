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
    return this.baberModel.findOne({ email }).exec();
  }

  async create(createBarberDto: any) {
    const createdBarber = await new this.baberModel(createBarberDto).save();
    return createdBarber;
  }

  async remove(id: string) {
    return this.baberModel.findByIdAndDelete(id).exec();
  }
}
