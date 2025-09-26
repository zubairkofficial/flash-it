import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { WORKSPACE_USER_PERMISSION } from 'src/utils/permission.enum';

export class CreateWorkspaceDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(WORKSPACE_USER_PERMISSION)
  @IsNotEmpty()
  role: WORKSPACE_USER_PERMISSION;

  @IsNumber()
  credits:number
}

export class UpdateWorkspaceDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  credits:number

  @IsEnum(WORKSPACE_USER_PERMISSION)
  @IsNotEmpty()
  role: WORKSPACE_USER_PERMISSION;
}