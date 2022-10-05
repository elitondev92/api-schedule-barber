import { Barber } from './../barbers/barbers.model';
import { Injectable } from '@nestjs/common';
import { BarbersService } from 'src/barbers/barbers.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly barbersService: BarbersService) {}

  async validateBarber(email: string, password: string): Promise<any> {
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
