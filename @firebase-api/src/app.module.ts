import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
