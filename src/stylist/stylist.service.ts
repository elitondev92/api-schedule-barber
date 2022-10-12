import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { Stylist, StylistDocument } from './entities/stylist.entity';
import AppError from '../errors/AppError';

@Injectable()
export class StylistService {
  constructor(
    @InjectModel(Stylist.name)
    private stylistModel: Model<StylistDocument>,
  ) {}

  public async create(createStylistDto: CreateStylistDto) {
    const checkStylist = await this.stylistModel
      .findOne({ name: createStylistDto.name })
      .exec();
    if (checkStylist) {
      throw new AppError('O profissional já existe');
    }
    const createdStylist = new this.stylistModel(createStylistDto);
    return createdStylist.save();
  }

  public async findAll(userId: string) {
    return this.stylistModel.find({ barber: userId }).exec();
  }

  findOne(id: string) {
    return this.stylistModel.findById(id).exec();
  }

  update(id: string, updateStylistDto: UpdateStylistDto) {
    const checkStylist = this.stylistModel
      .findOne({ name: updateStylistDto.name })
      .exec();
    if (checkStylist) {
      throw new AppError('O profissional já existe');
    }
    return this.stylistModel.findByIdAndUpdate(id, updateStylistDto).exec();
  }

  remove(id: string) {
    return this.stylistModel.findByIdAndDelete(id).exec();
  }
}
