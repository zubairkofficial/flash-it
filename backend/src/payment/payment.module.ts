import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthService } from 'src/auth/auth.service';
import { FlashcardService } from 'src/flashcard/flashcard.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService,AuthService,FlashcardService],
})
export class PaymentModule {}
