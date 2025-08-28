import {
  IsEmail,
  
  IsEnum,
  
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SUBSCRIPTION_TYPE } from 'src/utils/subscription.enum';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  temporary_flashcard_id: string;
}

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  temporary_flashcard_id: string;
}
export class UpdatePlanDTO {
  // @IsEnum(SUBSCRIPTION_TYPE)
  subscribePlan: SUBSCRIPTION_TYPE;
}
