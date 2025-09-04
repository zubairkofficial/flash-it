import { Controller, Get, Post, Body, Patch, Param, Delete, StreamableFile } from '@nestjs/common';
import { FlashcardSlidesService } from './flashcard-slides.service';

@Controller('flashcard-slides')
export class FlashcardSlidesController {
  constructor(private readonly flashcardSlidesService: FlashcardSlidesService) {}

  @Get('/:flashCardId')
 async generateFlashCard(@Param("flashCardId") flashCardId: number) {
    const pdfBuffer=await this.flashcardSlidesService.generateFlashCard(+flashCardId);
    
    return new StreamableFile(pdfBuffer.pdfBuffer , {
      type: 'application/pdf',
      disposition: `attachment; filename="${pdfBuffer.getFlashCardTitles[0].title}.pdf"`,
    });
  }

  @Get()
  findAll() {
    return this.flashcardSlidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashcardSlidesService.findOne(+id);
  }

 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardSlidesService.remove(+id);
  }
}
