import { Module } from '@nestjs/common';
import { FlashcardSlidesService } from './flashcard-slides.service';
import { FlashcardSlidesController } from './flashcard-slides.controller';

@Module({
  controllers: [FlashcardSlidesController],
  providers: [FlashcardSlidesService],
})
export class FlashcardSlidesModule {}
