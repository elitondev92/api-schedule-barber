import { Module } from '@nestjs/common';
import { WorkService } from './works.service';
import { WorkController } from './works.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Work, WorkSchema } from './entities/works.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Work.name, schema: WorkSchema }]),
  ],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorksModule {}
