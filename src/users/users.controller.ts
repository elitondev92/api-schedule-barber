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
import { UsersService } from './users.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import uploadConfig from '../config/upload';
import { UsersSerializer } from './serializer/users.serializer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): any {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOneById(@Param('id') _id: string): any {
    return plainToClass(UsersSerializer, this.usersService.findOneById(_id), {
      excludeExtraneousValues: true,
    });
  }

  @IsPublic()
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  create(@Body() createUserDto: any): any {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return plainToClass(
      UsersSerializer,
      this.usersService.update(id, updateUserDto),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', uploadConfig.multer))
  @Post('upload')
  async uploadFile(@UploadedFile() file) {
    return (
      this.usersService.saveFile(file.filename),
      {
        url: file.filename,
      }
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('gallery/:file')
  deleteFile(@Param('file') file: string) {
    return this.usersService.deleteFile(file);
  }
}
