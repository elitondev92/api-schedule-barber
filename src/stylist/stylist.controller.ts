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
} from '@nestjs/common';
import { StylistService } from './stylist.service';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { AuthGuard } from '@nestjs/passport';

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
}
