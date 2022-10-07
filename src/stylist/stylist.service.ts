import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { Stylist, StylistDocument } from './entities/stylist.entity';

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
      return { message: 'Stylist already exists' };
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
    return this.stylistModel.findByIdAndUpdate(id, updateStylistDto).exec();
  }

  remove(id: string) {
    return this.stylistModel.findByIdAndDelete(id).exec();
  }
}
