import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  LessonQuizResult,
  Quiz,
  QuizPayload,
  QuizResult,
} from '../shared/models';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('/:referenceId')
  getQuizByReferenceId(
    @Param('referenceId') referenceId: string,
  ): Promise<Quiz[]> {
    return this.quizService.getQuizByReferenceId(referenceId);
  }

  @Post('/level-check')
  levelCheck(@Body() payload: QuizPayload): Promise<QuizResult> {
    return this.quizService.levelCheck(payload);
  }

  @Post('/lesson/:lessonId')
  quizForLesson(
    @Param('lessonId') lessonId: string,
    @Body() payload: QuizPayload,
  ): Promise<LessonQuizResult> {
    return this.quizService.quizForLesson(lessonId, payload);
  }
}
