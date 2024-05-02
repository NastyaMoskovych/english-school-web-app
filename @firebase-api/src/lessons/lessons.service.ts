import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ENGLISH_LEVELS } from '../shared/constants';
import {
  Collections,
  EnglishLevel,
  Lesson,
  LessonContent,
  LessonExtended,
  UserLessons,
} from '../shared/models';
import { UserService } from '../user/user.service';
import { LessonsProgressService } from './lessons-progress.service';

@Injectable()
export class LessonsService {
  constructor(
    private firebaseService: FirebaseService,
    private lessonsProgressService: LessonsProgressService,
    private userService: UserService,
  ) {}

  async getLessonExtendedById(lessonId: string): Promise<LessonExtended> {
    return {
      ...(await this.getLessonById(lessonId)),
      ...(await this.getLessonContent(lessonId)),
    };
  }

  async getLessonsForUser(
    uid: string,
    level?: EnglishLevel,
  ): Promise<UserLessons> {
    const user = await this.userService.getUser(uid);

    if (level) {
      if (!ENGLISH_LEVELS.includes(level)) {
        throw new BadRequestException('Invalid level provided');
      }

      if (ENGLISH_LEVELS.indexOf(level) > ENGLISH_LEVELS.indexOf(user.level)) {
        throw new BadRequestException(
          'User level is lower than requested level',
        );
      }
    }

    const lessons = await this.getLessonsByLevel(level || user.level);

    return {
      userLevel: user.level,
      level: level || user.level,
      lessons: await Promise.all(
        lessons.map(async (lesson: Lesson) => {
          return {
            ...lesson,
            completed: await this.lessonsProgressService.isLessonCompleted(
              uid,
              lesson.id,
            ),
          };
        }),
      ),
    };
  }

  async isAllLessonsCompleted(
    userId: string,
  ): Promise<{ completed: boolean; lessonLevel: EnglishLevel }> {
    const { lessons } = await this.getLessonsForUser(userId);

    return {
      lessonLevel: lessons[0].level,
      completed: lessons.every(({ completed }) => completed),
    };
  }

  private async getLessonsByLevel(level: string): Promise<Lesson[]> {
    const snapshot = await this.firebaseService
      .firestore()
      .collection(Collections.LESSONS)
      .where('level', '==', level)
      .get();

    return snapshot.docs.map((doc) => doc.data() as Lesson);
  }

  private async getLessonContent(lessonId: string): Promise<LessonContent> {
    const snapshot = await this.firebaseService
      .firestore()
      .collection(Collections.LESSON_RESOURCES)
      .doc(lessonId)
      .get();

    return snapshot.data() as LessonContent;
  }

  private async getLessonById(lessonId: string): Promise<Lesson> {
    const snapshot = await this.firebaseService
      .firestore()
      .collection(Collections.LESSONS)
      .doc(lessonId)
      .get();

    return snapshot.data() as Lesson;
  }
}
