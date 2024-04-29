import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import {
  Collections,
  EnglishLevel,
  Lesson,
  LessonContent,
  LessonExtended,
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

  async getLessonsForUser(uid: string): Promise<Lesson[]> {
    const user = await this.userService.getUser(uid);
    const lessons = await this.getLessonsByLevel(user.level);

    return Promise.all(
      lessons.map(async (lesson: Lesson) => {
        return {
          ...lesson,
          completed: await this.lessonsProgressService.isLessonCompleted(
            uid,
            lesson.id,
          ),
        };
      }),
    );
  }

  async isAllLessonsCompleted(
    userId: string,
  ): Promise<{ completed: boolean; lessonLevel: EnglishLevel }> {
    const lessons = await this.getLessonsForUser(userId);

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
