import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { CorsGuard } from './guards/cors/cors.guard';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), QuizModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CorsGuard,
    },
  ],
})
export class AppModule {}
