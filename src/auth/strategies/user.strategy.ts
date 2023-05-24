import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import AppError from 'src/errors/AppError';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    return user;
  }
}
