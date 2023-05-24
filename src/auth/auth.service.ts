import { Barber } from './../barbers/entities/barber.entity';
import { User } from './../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { BarbersService } from 'src/barbers/barbers.service';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import AppError from 'src/errors/AppError';

@Injectable()
export class AuthService {
  constructor(
    private readonly barbersService: BarbersService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(barber: any) {
    const payload = { email: barber.email, sub: barber._id };
    const user = {
      email: barber.email,
      name: barber.name,
      _id: barber._id,
      image: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${barber.image}`,
    };
    return {
      user: user,
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

    const isPasswordValid = compareSync(password, barber.password);
    if (!isPasswordValid) {
      return null;
    }

    return barber;
  }

  // verify if token is valid
  async checkToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return payload;
    } catch (error) {
      throw new AppError('Expired or invalid token');
    }
  }

  async validateUser(email: string, password: string) {
    let user: User;

    try {
      user = await this.usersService.findOne(email);
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async loginUser(user: any) {
    const payload = { email: user.email, sub: user._id };
    const userLogged = {
      email: user.email,
      name: user.name,
      _id: user._id,
    };
    return {
      user: userLogged,
      token: this.jwtService.sign(payload),
    };
  }
}
