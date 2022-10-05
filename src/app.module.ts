import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarbersModule } from './barbers/barbers.module';
import { WorksModule } from './works/works.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://userApiBarber:AhpWQRYxv0EEAVDh@clusterdevbarber.n84cldj.mongodb.net/baberDB?retryWrites=true&w=majority',
    ),
    BarbersModule,
    WorksModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
