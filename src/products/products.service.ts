import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import AppError from '../errors/AppError';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

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
    const checkProduct = this.productModel
      .findOne({ name: updateProductDto.name })
      .exec();
    if (checkProduct) {
      throw new AppError('O produto já existe');
    }
    return this.productModel.findByIdAndUpdate(id, updateProductDto).exec();
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
