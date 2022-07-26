import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Create a new user if it's not existed, otherwise do nothing
   *
   * @param user
   * @returns User
   */
  async create(data): Promise<any> {
    const { email } = data;
    const userExists = await this.userModel.countDocuments({ email });
    if (userExists > 0) {
      throw new HttpException(
        {
          message: 'E-mail already exists.',
        },
        HttpStatus.CONFLICT,
      );
    }
    const { _id } = await this.userModel.create(data);
    return await this.userModel.findOne({ _id }, '-__v -password');
  }

  /**
   * Update a user
   *
   * @param data
   * @returns User
   */
  async update(data): Promise<any> {
    const { id } = data;
    await this.userModel.updateOne({ _id: id }, data);
    return await this.userModel.findOne({ _id: id }, '-__v -password');
  }

  async findOne(data): Promise<User | null> {
    return await this.userModel.findOne(data, '-__v -password -token');
  }

  async findOneWithPassword(data): Promise<User | null> {
    return await this.userModel.findOne(data, '-__v');
  }
}
