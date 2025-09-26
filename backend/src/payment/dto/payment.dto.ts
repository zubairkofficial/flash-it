import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { SUBSCRIPTION_TYPE } from "src/utils/subscription.enum";

export class CreatePaymentDto {
@IsNumber()
user_id:number


@IsEnum(SUBSCRIPTION_TYPE)
subscriptionType:SUBSCRIPTION_TYPE

@IsString()
cardNumber:string

@IsString()
cvv:string

@IsString()
expiry:string

@IsString()
name:string
}
export class CardPaymentDto {
   @IsNumber()
    price: number; 
    
    @IsString()
    token: string;
    
    @IsEnum(SUBSCRIPTION_TYPE)
    subscriptionType: SUBSCRIPTION_TYPE

    @IsOptional()
    @IsString()
    tempId:string
}
