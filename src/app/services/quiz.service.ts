import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Collections, Quiz } from '@shared/models';
import { Observable, lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private firestore: Firestore) {}

  async addQuiz(quiz: Quiz): Promise<void> {
    const docRef = doc(collection(this.firestore, Collections.QUIZZES));
    await setDoc(docRef, {
      ...quiz,
      id: docRef.id,
      createdAt: serverTimestamp(),
    });
  }

  async editQuiz(quiz: Quiz): Promise<void> {
    await updateDoc(doc(this.firestore, Collections.QUIZZES, quiz.id), {
      ...quiz,
    });
  }

  async deleteQuiz(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, Collections.QUIZZES, id));
  }

  async deleteQuizByReferenceId(referenceId: string): Promise<void> {
    const quizList = await lastValueFrom(
      this.getQuizListByReferenceId(referenceId).pipe(take(1)),
    );
    await Promise.all(quizList.map((quiz) => this.deleteQuiz(quiz.id)));
  }

  getQuizListByReferenceId(referenceId: string): Observable<Quiz[]> {
    const collectionRef = collection(this.firestore, Collections.QUIZZES);
    const collectionQueryRef = query(
      collectionRef,
      orderBy('createdAt', 'asc'),
      where('referenceId', '==', referenceId),
    );

    return collectionData(collectionQueryRef) as Observable<Quiz[]>;
  }
}
