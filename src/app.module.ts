import {
  Module,
  ValidationPipe,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { authModule } from './auth/auth.module';
import { DataSource } from 'typeorm';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { ArticlesModule } from './articles/articles.module';
import { CaslModule } from './casl/casl.module';
import { CommentsModule } from './comments/comments.module';
import { AppDataSource } from 'data-source';
import { GoogleStrategy } from './auth/stratiges/google.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.devlopment.env`,
      cache: true,
      load: [databaseConfig],
    }),

    TypeOrmModule.forRoot(AppDataSource.options),

    authModule,
    UsersModule,
    ArticlesModule,
    CaslModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    AppService,
    GoogleStrategy
  ],
})
export class AppModule {
 
}
