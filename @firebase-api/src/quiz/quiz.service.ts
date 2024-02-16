import { Injectable } from '@nestjs/common';
import { shuffle } from 'lodash';
import { FirestoreService } from '../firebase/firestore.service';
import { Collections, Quiz, QuizExtended, UserAnswer } from '../shared/models';
import { calculateUserLevel } from './utils/quiz.utils';

@Injectable()
export class QuizService {
  constructor(private firestoreService: FirestoreService) {}

  async getQuizByReferenceId(referenceId: string): Promise<QuizExtended[]> {
    const snapshot = await this.getBaseQuery(referenceId).get();
    return snapshot.docs.map((doc) => doc.data() as QuizExtended);
  }

  async levelCheck(userAnswers: UserAnswer[]) {
    const snapshot = await this.getBaseQuery('exam').get();
    const quizzes = snapshot.docs.map((doc) => doc.data() as QuizExtended);
    return calculateUserLevel(quizzes, userAnswers);
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

  private getBaseQuery(referenceId: string): FirebaseFirestore.Query<Quiz> {
    return this.firestoreService
      .collection(Collections.QUIZZES)
      .where('referenceId', '==', referenceId)
      .orderBy('level', 'asc')
      .orderBy('createdAt', 'asc');
  }
}
