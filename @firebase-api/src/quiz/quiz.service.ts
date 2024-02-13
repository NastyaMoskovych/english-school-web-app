import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import { Quiz } from './models';

@Injectable()
export class QuizService {
  constructor(private firestoreService: FirestoreService) {}

  async getQuizByReferenceId(referenceId: string): Promise<Quiz[]> {
    const snapshot = await this.firestoreService
      .collection('quizzes')
      .where('referenceId', '==', referenceId)
      .orderBy('level', 'asc')
      .orderBy('createdAt', 'asc')
      .select('id', 'question', 'answers')
      .get();

    return snapshot.docs.map((doc) => doc.data() as Quiz);
  }
}
