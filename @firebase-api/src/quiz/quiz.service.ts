import { BadRequestException, Injectable } from '@nestjs/common';
import { shuffle } from 'lodash';
import { FirebaseService } from '../firebase/firebase.service';
import { LessonsProgressService } from '../lessons/lessons-progress.service';
import {
  Collections,
  EXAM_REFERENCE_ID,
  EnglishLevel,
  LessonQuizResult,
  MINIMUM_CORRECT_ANSWERS,
  Quiz,
  QuizExtended,
  QuizPayload,
  QuizResult,
} from '../shared/models';
import { UserService } from '../user/user.service';
import { calculateUserLevel, checkLessonQuiz } from './utils/quiz.utils';

@Injectable()
export class QuizService {
  constructor(
    private firebaseService: FirebaseService,
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

    if (userLevel.correctAnswers > MINIMUM_CORRECT_ANSWERS) {
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
  ): Promise<LessonQuizResult> {
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
