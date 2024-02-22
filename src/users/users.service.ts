import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);
    createdUser.set('password', undefined, {strict: false});
    return createdUser;
  }
  
  async getByUsername(username: string): Promise<User|null> {
    const user = await this.userModel.findOne({username});
    return user;
  }
}
