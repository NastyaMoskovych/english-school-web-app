import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import {
  Collections,
  Lesson,
  LessonContent,
  LessonExtended,
} from '../shared/models';
import { UserService } from '../user/user.service';

@Injectable()
export class LessonsService {
  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
  ) {}

  async getLessonExtendedById(lessonId: string): Promise<LessonExtended> {
    return {
      ...(await this.getLessonById(lessonId)),
      ...(await this.getLessonContent(lessonId)),
    };
  }

  async getLessonsForUser(uid: string): Promise<LessonExtended[]> {
    const user = await this.userService.getUser(uid);
    return this.getLessonsByLevel(user.level);
  }

  private async getLessonsByLevel(level: string): Promise<LessonExtended[]> {
    const snapshot = await this.firebaseService
      .firestore()
      .collection(Collections.LESSONS)
      .where('level', '==', level)
      .get();

    return Promise.all(
      snapshot.docs.map(async (doc) => {
        const lesson = doc.data() as Lesson;
        const lessonContent = await this.getLessonContent(lesson.id);

        return {
          ...lesson,
          ...lessonContent,
        };
      }),
    );
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
