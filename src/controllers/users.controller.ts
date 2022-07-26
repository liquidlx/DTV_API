import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './../services';
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async find(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne({ _id: id });
  }
}
