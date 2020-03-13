import * as BCRYPT from 'bcrypt';
import * as validator from 'validator';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AppLogger } from '../logger/logger';
import { Errors } from '@shared/errors';
import { ILoginDto } from './dto/login.dto';
import { ITokenDto } from './dto/auth.dto';
import { IUserDoc } from '@user/document/user.doc';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '@user/dto/user.dto';
import { UserService } from '@user/user.service';
import { config } from '@config/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<IUserDoc>> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Wrong username');
    }

    const validPassword = BCRYPT.compareSync(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong password');
    }

    const { password: pwd, ...result } = user;

    return result;
  }

  async login(loginData: ILoginDto): Promise<ITokenDto | {}> {
    const user = await this.usersService.findOne(loginData.username);
    if (!user) {
      return {};
    }

    this.logger.info(`${user.username} logged in`);

    return {
      accessToken: this.jwtService.sign(user.toJSON()),
      expiresIn: config.jwt.expiresIn,
    };
  }

  async signup(signupData: UserDto): Promise<IUserDoc> {
    const validPassword = this.checkPassword(signupData.password);

    if (!validPassword) {
      throw new BadRequestException(
        Errors.ValidationError(
          'Password must contain min. 8 and max. 128 ASCII table characters',
        ),
      );
    }

    const hashed = BCRYPT.hashSync(
      signupData.password,
      BCRYPT.genSaltSync(config.policy.password.salt),
    );
    signupData.password = hashed;

    return this.usersService.create(signupData);
  }

  private checkPassword(pw: string) {
    if (
      !validator.default.isLength(pw, {
        min: config.policy.password.minLength,
        max: config.policy.password.maxLength,
      })
    )
      return false;

    if (!validator.default.isAscii(pw)) return false;

    return true;
  }
}
