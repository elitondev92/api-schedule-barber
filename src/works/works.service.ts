import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work, WorkDocument } from './entities/work.entity';
import AppError from 'src/errors/AppError';
import { S3 } from 'aws-sdk';
import { resolve } from 'path';
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
      .findOne({ name: createWorkDto.name })
      .exec();
    if (checkWork) {
      throw new AppError('Este serviço já existe');
    }
    const createdWork = new this.workModel(createWorkDto);
    return createdWork.save();
  }

  public async findAll(userId: string) {
    return await this.workModel.find({ barber: userId }).exec();
  }

  public async findOne(id: string, userId: string) {
    return await this.workModel.findById(id, { barber: userId }).exec();
  }

  public async update(id: string, updateWorkDto: UpdateWorkDto) {
    const checkWork = await this.workModel
      .findOne({ name: updateWorkDto.name })
      .exec();
    if (checkWork) {
      throw new AppError('Este serviço já existe');
    }
    return this.workModel.findByIdAndUpdate(id, updateWorkDto).exec();
  }

  public async remove(image: string, id: string) {
    await this.client
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: image,
      })
      .promise();

    this.workModel.findByIdAndDelete(id).exec();
    return { message: 'Serviço removido com sucesso' };
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

  // delete file from aws s3 bucket
  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: 'app-agendabarber2',
        Key: file,
      })
      .promise();
  }
}
