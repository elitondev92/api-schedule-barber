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
} from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BarbersService } from './barbers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly babersService: BarbersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): any {
    return this.babersService.findAll();
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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp/uploads',
        filename: (req, file, cb) => {
          crypto.randomBytes(16, (err, hash) => {
            if (err) cb(err, file.filename);

            const fileName = `${hash.toString('hex')}-${extname(
              file.originalname,
            )}`;

            cb(null, fileName);
          });
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file) {
    return (
      this.babersService.saveFile(file.filename),
      {
        url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${file.filename}`,
      }
    );
  }
}
