import { plainToClass } from 'class-transformer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
  UploadedFiles,
} from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BarbersService } from './barbers.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import uploadConfig from '../config/upload';
import { BarbersSerializer } from './serializer/barbers.serializer';
@Controller('barbers')
export class BarbersController {
  constructor(private readonly babersService: BarbersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): any {
    return this.babersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOneById(@Param('id') _id: string): any {
    return plainToClass(
      BarbersSerializer,
      this.babersService.findOneById(_id),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @IsPublic()
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  create(@Body() createBarberDto: any): any {
    return this.babersService.create(createBarberDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarberDto: any) {
    return plainToClass(
      BarbersSerializer,
      this.babersService.update(id, updateBarberDto),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.babersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadConfig.multer))
  async uploadFile(@UploadedFile() file) {
    return (
      this.babersService.saveFile(file.filename),
      {
        url: file.filename,
      }
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('gallery')
  @UseInterceptors(FilesInterceptor('files', 5, uploadConfig.multer))
  uploadFiles(@UploadedFiles() files) {
    for (const file of files) {
      this.babersService.saveFile(file.filename);
    }
    return [
      {
        photos: files.map((file) => file.filename),
      },
    ];
  }

  @UseGuards(JwtAuthGuard)
  @Patch('gallery/:id')
  deletePhoto(@Param('id') id: string, @Body() body: any) {
    return this.babersService.deletePhoto(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('gallery/:file')
  deleteFile(@Param('file') file: string) {
    return this.babersService.deleteFile(file);
  }
}
