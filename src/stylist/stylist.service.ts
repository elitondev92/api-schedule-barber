import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { Stylist, StylistDocument } from './entities/stylist.entity';
import AppError from '../errors/AppError';
import { S3 } from 'aws-sdk';
import { resolve } from 'path';
import * as fs from 'fs';

@Injectable()
export class StylistService {
  private client: S3;

  constructor(
    @InjectModel(Stylist.name)
    private stylistModel: Model<StylistDocument>,
  ) {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

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
  // upload file to aws s3 bucket
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
}
