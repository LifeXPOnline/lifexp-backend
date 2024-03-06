import {Body, Controller, Post, HttpCode} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {LoginUserDto} from 'src/users/dto/login-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(201)
    async register(@Body() body: CreateUserDto) {
        return await this.authService.registerUser(body);
    }

    @Post('login')
    async login(@Body() body: LoginUserDto) {
        return await this.authService.loginUser(body);
    }
}
