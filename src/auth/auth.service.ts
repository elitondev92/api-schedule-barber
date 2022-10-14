import { Barber } from './../barbers/barbers.model';
import { Injectable } from '@nestjs/common';
import { BarbersService } from 'src/barbers/barbers.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import AppError from 'src/errors/AppError';

@Injectable()
export class AuthService {
  constructor(
    private readonly barbersService: BarbersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(barber: any) {
    const payload = { email: barber.email, sub: barber._id };
    return {
      ...barber._doc,
      password: undefined,
      token: this.jwtService.sign(payload),
    };
  }
  async validateBarber(email: string, password: string) {
    let barber: Barber;

    try {
      barber = await this.barbersService.findOne(email);
    } catch (error) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await compareSync(password, barber.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return barber;
  }
}
