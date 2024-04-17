import { Controller, Get, Param } from '@nestjs/common';
import { LessonExtended } from '../shared/models';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('/:lessonId')
  getLessonById(@Param('lessonId') lessonId: string): Promise<LessonExtended> {
    return this.lessonsService.getLessonExtendedById(lessonId);
  }

  @Get('/user/:uid')
  getLessonsForUser(@Param('uid') uid: string): Promise<LessonExtended[]> {
    return this.lessonsService.getLessonsForUser(uid);
  }
}
