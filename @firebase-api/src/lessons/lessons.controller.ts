import { Controller, Get, Param, Query } from '@nestjs/common';
import { EnglishLevel, LessonExtended, UserLessons } from '../shared/models';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('/:lessonId')
  getLessonById(@Param('lessonId') lessonId: string): Promise<LessonExtended> {
    return this.lessonsService.getLessonExtendedById(lessonId);
  }

  @Get('/user/:uid')
  getLessonsForUser(
    @Param('uid') uid: string,
    @Query('level') level: EnglishLevel,
  ): Promise<UserLessons> {
    return this.lessonsService.getLessonsForUser(uid, level);
  }
}
