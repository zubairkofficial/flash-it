import { Module } from '@nestjs/common';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';
import { PdfService } from 'src/utils/pdf';

@Module({
  controllers: [FlashcardController],
  providers: [FlashcardService,PdfService]
})
export class FlashcardModule {}
