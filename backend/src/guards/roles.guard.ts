// src/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEYS } from '../decorators/roles.decorator';
import { WORKSPACE_USER_ROLE } from 'src/utils/workspace-user-role.enum';

export class RolesGuard implements CanActivate {
  constructor() {}

  private reflector = new Reflector();
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<WORKSPACE_USER_ROLE[]>(
      ROLE_KEYS,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access Denied: No user information');
    }

    const hasRole = roles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('Access Denied: Insufficient role');
    }

    return true;
  }
}
