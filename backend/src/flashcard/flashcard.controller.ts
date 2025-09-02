import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FlashCardGenerateDTO, RawDataUploadDTO } from './dto/flashcard.dto';
import { FlashcardService } from './flashcard.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

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
    @Body() rawDataUploadDTO: RawDataUploadDTO[],
    @Req() req: any,
  ) {
    return this.flashCardService.uploadRawData(rawDataUploadDTO, req);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getFlashCardById(
  @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.flashCardService.getFlashCardById(+id, req);
  }
}
