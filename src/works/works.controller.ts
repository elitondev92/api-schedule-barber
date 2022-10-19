import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';
import uploadConfig from '../config/upload';

@UseGuards(AuthGuard('jwt'))
@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Post()
  create(@Body() createWorkDto: CreateWorkDto, @Request() req) {
    const { user } = req;
    return this.worksService.create(user.userId, createWorkDto);
  }

  @Get()
  findAll(@Request() req) {
    const { user } = req;
    return this.worksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const { user } = req;
    return this.worksService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto) {
    return this.worksService.update(id, updateWorkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worksService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadConfig.multerConfig))
  async uploadFile(@UploadedFile() file) {
    return (
      this.worksService.saveFile(file.filename),
      {
        url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${file.filename}`,
      }
    );
  }
}
