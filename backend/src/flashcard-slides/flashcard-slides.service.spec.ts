import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSlidesService } from './flashcard-slides.service';

describe('FlashcardSlidesService', () => {
  let service: FlashcardSlidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardSlidesService],
    }).compile();

    service = module.get<FlashcardSlidesService>(FlashcardSlidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
