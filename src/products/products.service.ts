import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import AppError from '../errors/AppError';
import { S3 } from 'aws-sdk';
import { resolve } from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductsService {
  private client: S3;

  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

  public async create(createProductDto: CreateProductDto) {
    const checkProduct = await this.productModel
      .findOne({ name: createProductDto.name })
      .exec();
    if (checkProduct) {
      throw new AppError('O produto já existe');
    }
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  public async findAll(userId: string) {
    return this.productModel.find({ barber: userId }).exec();
  }

  findOne(id: string) {
    return this.productModel.findById(id).exec();
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto).exec();
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
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
