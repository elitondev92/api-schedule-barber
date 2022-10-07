import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarbersModule } from './barbers/barbers.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WorksModule } from './works/works.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
    ),
    BarbersModule,
    ProductsModule,
    WorksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
