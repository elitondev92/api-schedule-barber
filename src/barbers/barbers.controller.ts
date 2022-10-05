import { Body, Controller, Get, Post } from '@nestjs/common';
import { BarbersService } from './barbers.service';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly babersService: BarbersService) {}

  @Get()
  findAll(): any {
    return this.babersService.findAll();
  }

  @Post('signup')
  create(@Body() createBarberDto: any): any {
    return this.babersService.create(createBarberDto);
  }
}
