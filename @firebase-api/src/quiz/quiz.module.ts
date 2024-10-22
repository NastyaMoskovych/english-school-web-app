import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { LessonsModule } from '../lessons/lessons.module';
import { UserModule } from '../user/user.module';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [FirebaseModule, LessonsModule, UserModule],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
