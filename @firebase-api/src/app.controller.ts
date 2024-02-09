import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { FirestoreService } from './firebase/firestore.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firestoreService: FirestoreService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/quiz')
  async getQuiz() {
    const snapshot = await this.firestoreService
      .collection('quizzes')
      .where('referenceId', '==', 'exam')
      .orderBy('level', 'asc')
      .orderBy('createdAt', 'asc')
      .select('id', 'question', 'answers')
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }
}
