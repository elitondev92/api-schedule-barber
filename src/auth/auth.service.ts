import { Barber } from './../barbers/barbers.model';
import { Injectable } from '@nestjs/common';
import { BarbersService } from 'src/barbers/barbers.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly barbersService: BarbersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(barber: any) {
    const payload = { email: barber.email, sub: barber._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  async validateBarber(email: string, password: string) {
    let barber: Barber;

    try {
      barber = await this.barbersService.findOne(email);
    } catch (error) {
      return null;
    }

    const isPasswordValid = await compareSync(password, barber.password);
    if (!isPasswordValid) {
      return null;
    }

    return barber;
  }
}
