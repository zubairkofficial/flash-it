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
import {  FlashCardGenerateDTO, RawDataUploadDTO, UploadPdfGenerateDTO } from './dto/flashcard.dto';
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
  
  @Put('generate/:id')
  @UseGuards(JwtAuthGuard)
  async generateFirstFlashCard(
    @Param('id') id:string,
    @Req() req: any,
  ) {
    return this.flashCardService.generateFirstFlashCard(id, req, null);
  }

  @Post('upload-text')
  async uploadRawDataText(
    @Body() rawDataUploadDTO: RawDataUploadDTO,
    @Req() req: any,
  ) {
    return this.flashCardService.uploadRawDataText(rawDataUploadDTO, req);
  }
  @Post('authorized/upload-text')
  @UseGuards(JwtAuthGuard)
  async uploadRawDataTextAuth(
    @Body() rawDataUploadDTO: RawDataUploadDTO,
    @Req() req: any,
  ) {
    return this.flashCardService.uploadRawDataText(rawDataUploadDTO, req);
  }


  @Post('upload-data')
  @UseInterceptors(FilesInterceptor('files'))
 async uploadRawData(@UploadedFiles() files: Array<Express.Multer.File>,@Body() input: UploadPdfGenerateDTO,) {
  return this.flashCardService.uploadRawData(files,input);
  
}
  @Post('/authorized/upload-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
 async uploadAuthRawData(@UploadedFiles() files: Array<Express.Multer.File>,@Body() input: UploadPdfGenerateDTO, @Req() req: any,) {
  return this.flashCardService.uploadRawData(files,input, req);
  
}


  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getFlashCardById(
  @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.flashCardService.getFlashCardById(+id, req);
  }
  
  @Get('/temp/:tempId')
  @UseGuards(JwtAuthGuard)
  async getFlashCardByTempId(
  @Param('tempId') tempId: string,
    @Req() req: any,
  ) {
    return this.flashCardService.getFlashCardByTempId(tempId, req);
  }
}
