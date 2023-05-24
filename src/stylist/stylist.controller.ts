import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StylistService } from './stylist.service';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';

@UseGuards(AuthGuard('jwt'))
@Controller('stylist')
export class StylistController {
  constructor(private readonly stylistService: StylistService) {}

  @Post()
  create(@Body() createStylistDto: CreateStylistDto) {
    return this.stylistService.create(createStylistDto);
  }

  @Get()
  findAll(@Request() req) {
    const { user } = req;
    return this.stylistService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stylistService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStylistDto: UpdateStylistDto) {
    return this.stylistService.update(id, updateStylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stylistService.remove(id);
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
      this.stylistService.saveFile(file.filename),
      {
        url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${file.filename}`,
      }
    );
  }
}
