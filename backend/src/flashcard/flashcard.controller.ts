import {
  Body,
  Controller,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { FlashCardGenerateDTO, RawDataUploadDTO } from './dto/flashcard.dto';
import { FlashcardService } from './flashcard.service';

@Controller('flashcard')
export class FlashcardController {
  constructor(private flashCardService: FlashcardService) {}

  @Put('generate')
  //   @fix add jwt and roles guard
  async generateFlashCard(
    @Body() flashCardGenerateDTO: FlashCardGenerateDTO,
    @Req() req: any,
  ) {
    return this.flashCardService.generateFlashCard(flashCardGenerateDTO, req, null);
  }

  @Post('upload-data')
  async uploadRawData(
    @Body() rawDataUploadDTO: RawDataUploadDTO,
    @Req() req: any,
  ) {
    return this.flashCardService.uploadRawData(rawDataUploadDTO, req);
  }
}
