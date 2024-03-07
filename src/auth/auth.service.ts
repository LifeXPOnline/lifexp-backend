import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.getByEmail(createUserDto.email);
    if (existingUser)
      throw new HttpException(
        `User with email ${createUserDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const existingUser = await this.userService.getByEmail(
      loginUserDto.email,
      true,
    );
    if (!existingUser)
      throw new HttpException(`Wrong credentials`, HttpStatus.UNAUTHORIZED);
    const success = await bcrypt.compare(
      loginUserDto.password,
      existingUser.password,
    );
    if (success) {
      return {
        accessToken: this.jwtService.sign({
          firstname: existingUser.firstname,
          lastname: existingUser.lastname,
          email: existingUser.email,
        }),
      };
    } else {
      throw new HttpException(`Wrong credentials`, HttpStatus.UNAUTHORIZED);
    }
  }
}
