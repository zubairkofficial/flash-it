import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FlashcardService, JwtService],
})
export class AuthModule {}
