import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import AppError from 'src/errors/AppError';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const barber = await this.authService.validateBarber(email, password);
    if (!barber) {
      throw new AppError('Invalid credentials', 401);
    }
    return barber;
  }
}
