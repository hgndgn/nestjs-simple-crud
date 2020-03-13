import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { intersection, union } from 'lodash';

import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classLevelRoles = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    const methodLevelRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (
      (!methodLevelRoles || methodLevelRoles.length === 0) &&
      (!classLevelRoles || classLevelRoles.length === 0)
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.roles || user.roles.length === 0) {
      throw new UnauthorizedException('You do not have permission (Roles)');
    }

    const rolesUnion = union(classLevelRoles, methodLevelRoles);
    const rolesIntersection = intersection(user.roles, rolesUnion);

    // if '!strict' is included, then all required roles have to be present
    if (rolesUnion.includes('!strict')) {
      if (rolesIntersection.length !== rolesUnion.length - 1) {
        throw new UnauthorizedException('You do not have permission (Roles)');
      }
      return true;
    }

    if (rolesIntersection.length === 0) {
      throw new UnauthorizedException('You do not have permission (Roles)');
    }

    return true;
  }
}
