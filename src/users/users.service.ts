import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.userModel.create(createUserDto);
    const {password, ...strippedUser} = createdUser.toObject();
    return strippedUser;
  }
  
  async getByEmail(email: string, includePassword = false): Promise<User|null> {
    let projection: string[] | undefined;
    if (includePassword)
      projection = ['+password'];
    const user = await this.userModel.findOne({email}, projection);
    return user;
  }
}
