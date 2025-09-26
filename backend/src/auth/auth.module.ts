import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { JwtService } from '@nestjs/jwt';
import { PdfService } from 'src/utils/pdf';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FlashcardService, JwtService,PdfService],
})
export class AuthModule {}
