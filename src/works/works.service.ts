import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work, WorkDocument } from './entities/work.entity';
import AppError from 'src/errors/AppError';
import * as multer from 'multer';
import { S3 } from 'aws-sdk';
import crypto from 'crypto';
import { extname, resolve } from 'path';
import * as fs from 'fs';

@Injectable()
export class WorksService {
  private client: S3;

  constructor(@InjectModel(Work.name) private workModel: Model<WorkDocument>) {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

  public async create(userId: string, createWorkDto: CreateWorkDto) {
    const checkWork = await this.workModel
      .findOne({ barber: userId }, { name: createWorkDto.name })
      .exec();
    if (checkWork) {
      throw new AppError('Este serviço já existe');
    }
    const createdWork = new this.workModel(createWorkDto);
    return createdWork.save();
  }

  public async findAll(userId: string) {
    return this.workModel.find({ barber: userId }).exec();
  }

  public async findOne(userId: string, id: string) {
    return this.workModel.findById({ barber: userId }, id).exec();
  }

  public async update(id: string, updateWorkDto: UpdateWorkDto) {
    const checkWork = await this.workModel
      .findOne({ name: updateWorkDto.name })
      .exec();
    if (checkWork) {
      throw new AppError('Este serviço já existe');
    }
    if (updateWorkDto.image) {
      updateWorkDto.image = await this.updateFile(updateWorkDto.image, id);
    }
    return this.workModel.findByIdAndUpdate(id, updateWorkDto).exec();
  }

  public async remove(id: string) {
    return this.workModel.findByIdAndDelete(id).exec();
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

  public async updateFile(file: string, id: string): Promise<string> {
    const work = await this.workModel.findById(id).exec();
    if (work.image) {
      await this.deleteFile(work.image);
    }
    return this.saveFile(file);
  }
}
