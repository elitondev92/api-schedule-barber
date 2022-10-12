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

@UseGuards(AuthGuard('jwt'))
@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Post()
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.worksService.create(createWorkDto);
  }

  @Get()
  findAll(@Request() req) {
    const { user } = req;
    return this.worksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto) {
    return this.worksService.update(id, updateWorkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worksService.remove(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp/uploads',
        filename: (req, file, cb) => {
          crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(null, raw.toString('hex') + extname(file.originalname));
          });
        },
      }),
    }),
  )
  async uploadFile(@Param('id') id: string, @UploadedFile() file) {
    return this.worksService.saveFile(file.filename).then((url) =>
      this.worksService.update(id, {
        image: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${file.filename}`,
      }),
    );
  }
}
