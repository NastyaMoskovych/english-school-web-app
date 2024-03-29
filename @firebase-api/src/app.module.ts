import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthGuard } from './guards/auth/auth.guard';
import { CorsGuard } from './guards/cors/cors.guard';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [FirebaseModule, ConfigModule.forRoot({ cache: true }), QuizModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CorsGuard,
    },
  ],
})
export class AppModule {}
