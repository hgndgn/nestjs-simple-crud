import { Controller, UseGuards, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ILoginDto } from './dto/login.dto';
import { UserDto } from '../user/dto/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res() res: Response, @Body() loginData: ILoginDto) {
    const result = await this.authService.login(loginData);
    res.status(200).send(result);
  }

  @Post('signup')
  async signup(@Body() signupData: UserDto) {
    return await this.authService.signup(signupData);
  }
}
