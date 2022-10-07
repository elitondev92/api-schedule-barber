import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work, WorkDocument } from './entities/work.entity';

@Injectable()
export class WorksService {
  constructor(
    @InjectModel(Work.name)
    private workModel: Model<WorkDocument>,
  ) {}

  public async create(createWorkDto: CreateWorkDto) {
    const checkWork = await this.workModel
      .findOne({ name: createWorkDto.name })
      .exec();
    if (checkWork) {
      return { message: 'Work already exists' };
    }
    const createdWork = new this.workModel(createWorkDto);
    return createdWork.save();
  }

  findAll(userId: string) {
    return this.workModel.find({ barber: userId }).exec();
  }

  findOne(id: string) {
    return this.workModel.findById(id).exec();
  }

  update(id: string, updateWorkDto: UpdateWorkDto) {
    return this.workModel.findByIdAndUpdate(id, updateWorkDto).exec();
  }

  remove(id: string) {
    return this.workModel.findByIdAndDelete(id).exec();
  }
}
