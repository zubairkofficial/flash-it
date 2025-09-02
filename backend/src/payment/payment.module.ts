import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthService } from 'src/auth/auth.service';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { PdfService } from 'src/utils/pdf';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService,AuthService,FlashcardService,PdfService],
})
export class PaymentModule {}
