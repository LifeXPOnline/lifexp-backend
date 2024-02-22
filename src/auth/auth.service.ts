import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async registerUser(createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }
}
