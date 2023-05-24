import { Module } from '@nestjs/common';
import { StylistService } from './stylist.service';
import { StylistController } from './stylist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stylist, StylistSchema } from './entities/stylist.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stylist.name, schema: StylistSchema }]),
  ],
  controllers: [StylistController],
  providers: [StylistService],
})
export class StylistModule {}
