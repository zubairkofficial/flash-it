import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FlashcardService } from 'src/flashcard/flashcard.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FlashcardService]
})
export class AuthModule {}
