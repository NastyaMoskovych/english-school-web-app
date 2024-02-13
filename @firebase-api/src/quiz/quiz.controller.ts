import { Controller, Get } from '@nestjs/common';
import { Quiz } from './models';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('/level-check')
  getQuizByReferenceId(): Promise<Quiz[]> {
    return this.quizService.getQuizByReferenceId('exam');
  }
}
