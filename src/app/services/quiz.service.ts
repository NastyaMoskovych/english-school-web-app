import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
import {
  Collections,
  Quiz,
  QuizExtended,
  QuizPayload,
  QuizResult,
} from '@firebase-api/models';
import { Observable, catchError, lastValueFrom, take, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SnackbarMessages, SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(
    private firestore: Firestore,
    private http: HttpClient,
    private snackbar: SnackbarService,
  ) {}

  async addQuiz(quiz: QuizExtended): Promise<void> {
    const docRef = doc(collection(this.firestore, Collections.QUIZZES));
    await setDoc(docRef, {
      ...quiz,
      id: docRef.id,
      createdAt: serverTimestamp(),
    });
  }

  async editQuiz(quiz: QuizExtended): Promise<void> {
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

  getQuizListByReferenceId(referenceId: string): Observable<QuizExtended[]> {
    const collectionRef = collection(this.firestore, Collections.QUIZZES);
    const collectionQueryRef = query(
      collectionRef,
      where('referenceId', '==', referenceId),
      orderBy('level', 'asc'),
      orderBy('createdAt', 'asc'),
    );

    return collectionData(collectionQueryRef) as Observable<QuizExtended[]>;
  }

  getQuizByReferenceId(referenceId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(
      `${environment.firebaseApi}/quiz/${referenceId}`,
    );
  }

  checkUserLevel(payload: QuizPayload): Observable<QuizResult> {
    return this.http
      .post<QuizResult>(`${environment.firebaseApi}/quiz/level-check`, payload)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.snackbar.show({
            type: 'error',
            message: SnackbarMessages.SUBMIT_QUIZ_FAILED,
          });
          return throwError(() => e);
        }),
      );
  }

  submitQuizForLesson(
    lessonId: string,
    payload: QuizPayload,
  ): Observable<QuizResult> {
    return this.http.post<QuizResult>(
      `${environment.firebaseApi}/quiz/lesson/${lessonId}`,
      payload,
    );
  }
}
