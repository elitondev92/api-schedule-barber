import { plainToClass } from 'class-transformer';
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
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import uploadConfig from '../config/upload';
import { WorksSerializer } from './serializer/works.serializer';

@UseGuards(AuthGuard('jwt'))
@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Post()
  create(@Body() createWorkDto: CreateWorkDto, @Request() req) {
    const { user } = req;
    return this.worksService.create(user.userId, createWorkDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Request() req) {
    const { user } = req;

    return plainToClass(
      WorksSerializer,
      this.worksService.findAll(user.userId),
      { excludeExtraneousValues: true, enableImplicitConversion: true },
    );
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
  remove(@Param('id') id: string, @Body() body) {
    return this.worksService.remove(body.file, id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadConfig.multer))
  async uploadFile(@UploadedFile() file) {
    return (
      this.worksService.saveFile(file.filename),
      {
        url: file.filename,
      }
    );
  }
}
