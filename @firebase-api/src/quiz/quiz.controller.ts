import { Body, Controller, Get, Post } from '@nestjs/common';
import { Quiz, UserAnswer } from '../shared/models';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('/level-check')
  getQuizForLevelCheck(): Promise<Quiz[]> {
    return this.quizService.getQuizForLevelCheck();
  }

  @Post('/level-check')
  levelCheck(@Body() payload: UserAnswer[]) {
    return this.quizService.levelCheck(payload);
  }

  // @Get('/:referenceId')
  // getQuizByReferenceId(
  //   @Param('referenceId') referenceId: string,
  // ): Promise<QuizExtended[]> {
  //   return this.quizService.getQuizByReferenceId(referenceId);
  // }
}