import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FlashCardGenerateDTO, RawDataUploadDTO } from './dto/flashcard.dto';
import { FlashcardService } from './flashcard.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import {  FilesInterceptor } from '@nestjs/platform-express/multer';

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

  // @Post('upload-data')
  // async uploadRawData(
  //   @Body() rawDataUploadDTO: RawDataUploadDTO[],
  //   @Req() req: any,
  // ) {
  //   return this.flashCardService.uploadRawData(rawDataUploadDTO, req);
  // }


  @Post('upload-data')
  @UseInterceptors(FilesInterceptor('files'))
 async uploadRawData(@UploadedFiles() files: Array<Express.Multer.File>,@Body('language') language: string, @Req() req: any,) {
  return this.flashCardService.uploadRawData(files,language, req);
  
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
