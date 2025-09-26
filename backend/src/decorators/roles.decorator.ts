import { SetMetadata } from '@nestjs/common';
import { WORKSPACE_USER_ROLE } from 'src/utils/workspace-user-role.enum';

export const ROLE_KEYS = 'roles';

export const Roles = (...roles: WORKSPACE_USER_ROLE[]) =>
  SetMetadata(ROLE_KEYS, roles);
