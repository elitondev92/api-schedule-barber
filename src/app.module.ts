import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarbersModule } from './barbers/barbers.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WorksModule } from './works/works.module';
import { StylistModule } from './stylist/stylist.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
    ),
    BarbersModule,
    MulterModule.register({
      dest: 'tmp/uploads',
    }),
    ProductsModule,
    WorksModule,
    AuthModule,
    StylistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
