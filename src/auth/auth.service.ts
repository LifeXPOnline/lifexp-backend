import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async registerUser(createUserDto: CreateUserDto) {
        const existingUser = await this.userService.getByUsername(createUserDto.username);
        if (existingUser)
            throw new HttpException(`User with username ${createUserDto.username} already exists`, HttpStatus.BAD_REQUEST);
        const createdUser = await this.userService.create(createUserDto);
        return createdUser;
    }
}
