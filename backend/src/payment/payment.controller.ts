import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CardPaymentDto, CreatePaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  cardPaymentCreate(@Body() input,@Req() req:any) {
    return this.paymentService.cardPaymentCreate(input,req);
  }

 
}
