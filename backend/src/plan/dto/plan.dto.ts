import { IsEnum, IsNotEmpty,  IsOptional,  IsString } from 'class-validator';
import { SUBSCRIPTION_TYPE } from 'src/utils/subscription.enum';

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    tempId: string;

    @IsOptional()
    @IsEnum(SUBSCRIPTION_TYPE)
   subscriptionType:SUBSCRIPTION_TYPE
}

