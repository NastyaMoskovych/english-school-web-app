import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [FirebaseModule],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
