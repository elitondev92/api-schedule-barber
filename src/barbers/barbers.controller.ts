import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BarbersService } from './barbers.service';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.babersService.remove(id);
  }
}
