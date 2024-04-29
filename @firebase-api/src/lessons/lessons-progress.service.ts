import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Collections, QuizResult, QuizStatuses } from '../shared/models';

@Injectable()
export class LessonsProgressService {
  constructor(private firebaseService: FirebaseService) {}

  async updateProgress(
    userId: string,
    lessonId: string,
    quizResult: QuizResult,
  ): Promise<void> {
    if (!userId || !lessonId || !quizResult) {
      throw new BadRequestException('Invalid request data');
    }

    const serverTimestamp = this.firebaseService.serverTimestamp();
    const baseQuery = this.firebaseService
      .firestore()
      .collection(Collections.LESSONS_PROGRESS);

    const snapshot = await baseQuery
      .where('userId', '==', userId)
      .where('lessonId', '==', lessonId)
      .get();

    if (snapshot.empty) {
      await baseQuery.add({
        userId,
        lessonId,
        status: quizResult.status,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
      });
    } else {
      await baseQuery.doc(snapshot.docs[0].id).update({
        status: quizResult.status,
        updatedAt: serverTimestamp,
      });
    }
  }

  async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    const snapshot = await this.firebaseService
      .firestore()
      .collection(Collections.LESSONS_PROGRESS)
      .where('userId', '==', userId)
      .where('lessonId', '==', lessonId)
      .get();

    if (snapshot.empty) {
      return false;
    }

    return snapshot.docs[0].data().status === QuizStatuses.COMPLETED;
  }
}
