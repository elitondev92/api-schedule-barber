import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber, BarberDocument } from './entities/barber.entity';
import AppError from 'src/errors/AppError';
import { S3 } from 'aws-sdk';
import { resolve } from 'path';
import * as fs from 'fs';
import { map } from 'rxjs';

@Injectable()
export class BarbersService {
  private client: S3;

  constructor(
    @InjectModel(Barber.name) private baberModel: Model<BarberDocument>,
  ) {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

  async findAll() {
    return this.baberModel.find().exec();
  }

  async findOne(email: string) {
    const barber = await this.baberModel.findOne({ email }).exec();
    if (!barber) {
      throw new Error('Barber not found');
    }
    return barber as Barber;
  }

  async findOneById(_id: string) {
    const barber = await this.baberModel.findOne({ _id }).exec();
    if (!barber) {
      throw new Error('Barber not found');
    }
    return barber as Barber;
  }

  async create(createBarberDto: CreateBarberDto) {
    const checkBarber = await this.baberModel
      .findOne({ email: createBarberDto.email })
      .exec();
    if (checkBarber) {
      throw new AppError('Barbeiro já cadastrado');
    }
    const createdBarber = await new this.baberModel(createBarberDto).save();
    return createdBarber;
  }

  async update(id: string, updateBarberDto: UpdateBarberDto) {
    const checkBarber = await this.baberModel
      .findOne({ email: updateBarberDto.email })
      .exec();
    if (checkBarber) {
      throw new AppError('Barbeiro já cadastrado');
    }
    return this.baberModel.findByIdAndUpdate(id, updateBarberDto).exec();
  }

  async remove(id: string) {
    return this.baberModel.findByIdAndDelete(id).exec();
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = resolve(__dirname, '..', '..', 'tmp', 'uploads', file);

    const mime = require('mime');

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new AppError('File not found');
    }

    const fileContent = fs.readFileSync(originalPath);

    await this.client
      .putObject({
        Bucket: process.env.AWS_BUCKET,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: file,
      })
      .promise();
  }

  // delete photo from photos array
  public async deletePhoto(id: string, photo: string) {
    const barber = await this.baberModel.findById(id).exec();
    const photos = barber.photos;

    // check if barber exists
    try {
      if (!barber) {
        throw new AppError('Barber not found');
      }
    } catch (error) {
      throw new AppError(error.message);
    }

    // filter photo

    const filteredPhotos = photos.filter((item) => !photo.includes(item));

    // update barber
    await this.baberModel.findByIdAndUpdate(id, { photos: filteredPhotos });

    return barber.photos;
  }
}
