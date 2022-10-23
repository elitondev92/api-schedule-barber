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
} from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BarbersService } from './barbers.service';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarberDto: any) {
    return this.babersService.update(id, updateBarberDto);
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
}
