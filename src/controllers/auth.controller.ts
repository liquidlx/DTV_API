import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './../services';
import { UserDto } from './../entities/dtos/UserDto';
import { comparePassword, hashPassword } from './../utils/password_hash';
import { SignUpRequest } from 'src/entities/requests/users.request';
import * as jwt from 'jsonwebtoken';
import { now } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async signUp(@Body() body: SignUpRequest): Promise<any> {
    console.log(body);
    const { password, email } = body;
    // encrypt password
    body.password = await hashPassword(password);

    const token = await jwt.sign(
      { email, password: body.password },
      process.env.PRIVATE_KEY,
    );

    console.log(token);

    return await this.usersService.create({ ...body, token });
  }

  @Post('/signin')
  async signIn(@Body() body: SignUpRequest) {
    const { email, password } = body;
    const user = await this.usersService.findOneWithPassword({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'Invalid username and/or password',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const passwordIsEqual = await comparePassword(password, user.password);
    if (!passwordIsEqual) {
      throw new HttpException(
        {
          message: 'Invalid username and/or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await jwt.sign(
      { email, password: user.password },
      process.env.PRIVATE_KEY,
    );

    user.token = token;
    user.lastLogin = new Date().toString();

    return await this.usersService.update(user);
  }
}
