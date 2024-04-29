import { BadRequestException, Injectable } from '@nestjs/common';
import { shuffle } from 'lodash';
import { FirebaseService } from '../firebase/firebase.service';
import { LessonsProgressService } from '../lessons/lessons-progress.service';
import { LessonsService } from '../lessons/lessons.service';
import {
  Collections,
  EXAM_REFERENCE_ID,
  EnglishLevel,
  Quiz,
  QuizExtended,
  QuizPayload,
  QuizResult,
  QuizStatuses,
} from '../shared/models';
import { UserService } from '../user/user.service';
import { calculateUserLevel, checkLessonQuiz } from './utils/quiz.utils';

@Injectable()
export class QuizService {
  constructor(
    private firebaseService: FirebaseService,
    private lessonsService: LessonsService,
    private lessonsProgressService: LessonsProgressService,
    private userService: UserService,
  ) {}

  async getQuizByReferenceId(referenceId: string): Promise<Quiz[]> {
    const snapshot = await this.getBaseQuery(referenceId)
      .select('id', 'question', 'answers')
      .get();

    return shuffle(
      snapshot.docs
        .map((doc) => doc.data() as Quiz)
        .map((quiz: Quiz) => ({
          ...quiz,
          answers: shuffle(quiz.answers),
        })),
    );
  }

  async levelCheck(payload: QuizPayload): Promise<QuizResult> {
    const snapshot = await this.getBaseQuery(EXAM_REFERENCE_ID).get();
    const quizzes = snapshot.docs.map((doc) => doc.data() as QuizExtended);
    const userLevel = calculateUserLevel(quizzes, payload.answers);
    let sessionId: string;

    if (userLevel.status === QuizStatuses.COMPLETED) {
      sessionId = (await this.saveQuizResults(
        payload,
        userLevel.level,
      )) as string;
    }

    if (sessionId) {
      Object.assign(userLevel, { sessionId });
    }

    return userLevel;
  }

  async quizForLesson(
    lessonId: string,
    payload: QuizPayload,
  ): Promise<QuizResult> {
    if (!payload.uid || !lessonId) {
      throw new BadRequestException('Invalid payload');
    }

    const snapshot = await this.getBaseQuery(lessonId).get();
    const quizzes = snapshot.docs.map((doc) => doc.data() as QuizExtended);
    const result = checkLessonQuiz(quizzes, payload.answers);

    await this.lessonsProgressService.updateProgress(
      payload.uid,
      lessonId,
      result,
    );

    if (result.status === QuizStatuses.COMPLETED) {
      const { lessonLevel, completed } =
        await this.lessonsService.isAllLessonsCompleted(payload.uid);

      if (completed) {
        Object.assign(result, {
          nextLevel: await this.userService.increaseUserLevel(
            payload.uid,
            lessonLevel,
          ),
        });
      }
    }

    return result;
  }

  private getBaseQuery(
    referenceId: string,
  ): FirebaseFirestore.Query<Quiz, Document> {
    return this.firebaseService
      .firestore()
      .collection(Collections.QUIZZES)
      .where('referenceId', '==', referenceId)
      .orderBy('level', 'asc')
      .orderBy('createdAt', 'asc');
  }

  private async saveQuizResults(
    payload: QuizPayload,
    level: EnglishLevel,
  ): Promise<void | string> {
    if (payload.uid) {
      await this.userService.updateUserLevel(level, payload.uid);
    } else {
      return await this.userService.saveLevelForGuest(level);
    }
  }
}
