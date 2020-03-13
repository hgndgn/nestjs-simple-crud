import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AppLogger } from '@logger/logger';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '@user/dto/user.dto';

/**
 * A dummy middleware
 */
@Injectable()
export class RolesMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService, private logger: AppLogger) {
    this.logger.setContext(RolesMiddleware.name);
  }

  use(req: Request, _: Response, next: Function) {
    const auth = req.headers.authorization;
    const token = (auth && auth.split(' ')[1]) || '';

    if (!token) {
      throw new UnauthorizedException();
    }

    const user: UserDto = JSON.parse(
      JSON.stringify(this.jwtService.decode(token)),
    );

    this.logger.debug(`${user.username} roles: [${user.roles}]`);

    next();
  }
}
