import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FlashCardGenerateDTO,
  RawDataUploadDTO,
  UploadPdfGenerateDTO,
} from './dto/flashcard.dto';
import { FlashcardService } from './flashcard.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { FilesInterceptor } from '@nestjs/platform-express/multer';

@Controller('flashcard')
export class FlashcardController {
  constructor(private flashCardService: FlashcardService) {}

  @Put('generate')
  //@fix add jwt and roles guard
  @UseGuards(JwtAuthGuard)
  async generateFlashCard(
    @Body() flashCardGenerateDTO: FlashCardGenerateDTO,
    @Req() req: any,
  ) {
    return this.flashCardService.generateFlashCard(
      flashCardGenerateDTO,
      req,
      null,
    );
  }

  // @Post('generate/:id')
  // @UseGuards(JwtAuthGuard)
  // async generateFirstFlashCard(@Param('id') id: string, @Req() req: any) {
  //   return this.flashCardService.generateFirstFlashCard(id, req, null);
  // }

  @Post('upload-data')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadRawData(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() input: RawDataUploadDTO,
    @Req() req: any,
  ) {
    return this.flashCardService.uploadRawData(files, input, req);
  }

  // @Post('authorized/upload-data')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FilesInterceptor('files'))
  // async uploadAuthRawData(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Body() input: RawDataUploadDTO,
  //   @Req() req: any,
  // ) {
  //   return this.flashCardService.uploadRawData(files, input, req);
  // }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getFlashCardById(@Param('id') id: string, @Req() req: any) {
    return this.flashCardService.getFlashCardById(+id, req);
  }

  @Get('/temp/:tempId')
  @UseGuards(JwtAuthGuard)
  async getFlashCardByTempId(@Param('tempId') tempId: string, @Req() req: any) {
    return this.flashCardService.getFlashCardByTempId(tempId, req);
  }

  // Get raw data for a flashcard
  @Get(':id/raw-data')
  @UseGuards(JwtAuthGuard)
  async getRawData(@Param('id') id: string, @Req() req: any) {
    return this.flashCardService.getRawDataByFlashcardId(+id, req);
  }

  // Add raw data to a flashcard
  @Post(':id/raw-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async addRawData(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() rawDataUploadDTO: RawDataUploadDTO,
    @Req() req: any,
  ) {
    return this.flashCardService.addRawDataToFlashcard(
      +id,
      files,
      rawDataUploadDTO,
      req,
    );
  }

  // Regenerate flashcard by id
  @Post('regenerate-flashcard/:id')
  @UseGuards(JwtAuthGuard)
  async regenerateFlashcard(@Param('id') id: string, @Req() req: any) {
    return this.flashCardService.regenerateFlashcard(+id, req);
  }

  // Delete raw data from a flashcard
  @Post(':id/raw-data/delete')
  @UseGuards(JwtAuthGuard)
  async deleteRawData(
    @Param('id') id: string,
    @Body('rawDataId') rawDataId: number,
    @Req() req: any,
  ) {
    return this.flashCardService.deleteRawDataFromFlashcard(
      +id,
      rawDataId,
      req,
    );
  }
}
