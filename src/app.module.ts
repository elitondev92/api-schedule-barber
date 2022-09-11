import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BarbersModule } from './barbers/barbers.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://userApiBarber:AhpWQRYxv0EEAVDh@clusterdevbarber.n84cldj.mongodb.net/baberDB?retryWrites=true&w=majority',
    ),
    BarbersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
