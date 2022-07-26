import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      throw new HttpException(
        {
          message: 'Not Authorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorizationHeader.split(' ')[1];
    const { email, password } = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await this.usersService.findOne({ email });
    if (!user) return false;
    const diffTime =
      new Date().getTime() - new Date(user.lastLogin.toString()).getTime();

    const diffTimeMin = Math.floor(diffTime / 1000 / 60);
    console.log('dif time', diffTimeMin);
    console.log(user.token, token);
    if (user?.token !== token || diffTimeMin > 30) {
      throw new HttpException(
        {
          message: 'Not Authorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
