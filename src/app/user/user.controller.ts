import { RolesGuard } from '@shared/guards/roles.guard';
import { UserDto } from '@user/dto/user.dto';
import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  Post,
  Put,
  Query,
  Delete,
} from '@nestjs/common';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { Roles } from '@shared/decorator/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('Special', '!strict')
  @Post('random/create')
  async createMultiple() {
    return await this.userService.createMultipleRandom();
  }

  @Get('all')
  async getByRole(@Query('role') role: string) {
    return await this.userService.findAllByRole(role);
  }

  @Get('all')
  async getAll() {
    return await this.userService.findAll();
  }

  @Roles('User')
  @Get(':username')
  async getOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Put('update/:username')
  async updateOne(
    @Param('username') username: string,
    @Body() payload: UserDto,
  ) {
    return this.userService.updateOne(username, payload);
  }

  @Delete('delete/:id')
  async deleteOne(@Param('id') userId: string) {
    return await this.userService.deleteOne(userId);
  }
}
