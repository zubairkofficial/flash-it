import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
