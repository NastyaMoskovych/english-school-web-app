import { Injectable } from '@nestjs/common';
import { shuffle } from 'lodash';
import { FirebaseService } from '../firebase/firebase.service';
import {
  Collections,
  EnglishLevel,
  MINIMUM_CORRECT_ANSWERS,
  Quiz,
  QuizExtended,
  QuizPayload,
  QuizResult,
} from '../shared/models';
import { UserService } from '../user/user.service';
import { calculateUserLevel } from './utils/quiz.utils';

@Injectable()
export class QuizService {
  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
  ) {}

  async getQuizByReferenceId(referenceId: string): Promise<QuizExtended[]> {
    const snapshot = await this.getBaseQuery(referenceId).get();
    return snapshot.docs.map((doc) => doc.data() as QuizExtended);
  }

  async levelCheck(payload: QuizPayload): Promise<QuizResult> {
    const snapshot = await this.getBaseQuery('exam').get();
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

  async getQuizForLevelCheck(): Promise<Quiz[]> {
    const snapshot = await this.getBaseQuery('exam')
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
