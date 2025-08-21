import { BadRequestException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import User from './models/user.model';
import { SubscriptionPlan } from './models/subscription-plan.model';
import Invite from './models/invite.model';
import WorkSpace from './models/workspace.model';
import WorkspaceUser from './models/workspace-user.model';
import WorkspaceUserPermission from './models/workspace-user-permission.model';
import FlashCard from './models/flashcard.model';
import FlashCardRawData from './models/flashcard-raw-data.model';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { PlanModule } from './plan/plan.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import FlashCardSlide from './models/flashcard-slide.model';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = join(__dirname, '..', 'uploads');

          // check if folder exists, if not create it
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.filename + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      // ✅ Allow only PDFs
      fileFilter: (req, file, callback) => {
        if (!file) return callback(null, true);
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new BadRequestException('Only PDF files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRATION },
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      models: [
        User,
        FlashCard,
        FlashCardRawData,
        SubscriptionPlan,
        Invite,
        WorkSpace,
        WorkspaceUser,
        WorkspaceUserPermission,
        FlashCardSlide
      ],
      synchronize: process.env.DB_SYNCHRONIZE == 'true' ? true : false,
      logging: true,

      sync: {
        force: process.env.NODE_ENV == 'development' ? false : false,
        alter: process.env.NODE_ENV == 'development' ? true : false,
      },
      retryDelay: 3000,
    }),
    AuthModule,
    FlashcardModule,
    PlanModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
