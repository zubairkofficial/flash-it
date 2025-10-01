import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthService } from 'src/auth/auth.service';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { PdfService } from 'src/utils/pdf';
import { PlanService } from 'src/plan/plan.service';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    AuthService,
    FlashcardService,
    PdfService,
    PlanService,
  ],
})
export class PaymentModule {}
