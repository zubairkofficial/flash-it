import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSlidesController } from './flashcard-slides.controller';
import { FlashcardSlidesService } from './flashcard-slides.service';

describe('FlashcardSlidesController', () => {
  let controller: FlashcardSlidesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardSlidesController],
      providers: [FlashcardSlidesService],
    }).compile();

    controller = module.get<FlashcardSlidesController>(FlashcardSlidesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
