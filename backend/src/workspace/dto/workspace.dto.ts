import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { WORKSPACE_USER_PERMISSION } from 'src/utils/permission.enum';

export class CreateWorkspaceDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateWorkspaceDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(WORKSPACE_USER_PERMISSION)
  @IsNotEmpty()
  role: WORKSPACE_USER_PERMISSION;
}