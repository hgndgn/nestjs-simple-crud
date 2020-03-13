import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ILoginDto } from './dto/login.dto';
import { UserDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginData: ILoginDto) {
    return this.authService.login(loginData);
  }

  @Post('signup')
  async signup(@Body() signupData: UserDto) {
    return this.authService.signup(signupData);
  }
}
