import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import AppError from 'src/errors/AppError';
import { S3 } from 'aws-sdk';
import { resolve } from 'path';
import * as fs from 'fs';
import { map } from 'rxjs';

@Injectable()
export class UsersService {
  private client: S3;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user as User;
  }

  async findOneById(_id: string) {
    const user = await this.userModel.findOne({ _id }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user as User;
  }

  async create(createUserDto: CreateUserDto) {
    const checkUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (checkUser) {
      throw new AppError('User already registered');
    }
    const createdUser = await new this.userModel(createUserDto).save();
    return createdUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const checkUser = await this.userModel
      .findOne({
        email: updateUserDto.email,
      })
      .exec();
    if (checkUser) {
      throw new AppError('User already registered');
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
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
    try {
      await this.client
        .deleteObject({
          Bucket: process.env.AWS_BUCKET,
          Key: file,
        })
        .promise();
    } catch (error) {
      throw new AppError(error.message);
    }
  }
}
