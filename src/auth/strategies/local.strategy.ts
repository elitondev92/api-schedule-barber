import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BarbersService } from 'src/barbers/barbers.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  AuthService: AuthService;
  constructor(private readonly barbersService: BarbersService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const barber = await this.AuthService.validateBarber(email, password);

    if (!barber) {
      throw new UnauthorizedException('Credentials are invalid');
    }

    return barber;
  }
}
