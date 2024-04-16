import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  Collections,
  Lesson,
  LessonContent,
  LessonExtended,
} from '@firebase-api/models';
import {
  Observable,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  take,
} from 'rxjs';
import { IUser } from '../shared/models';
import { AuthService } from './auth.service';
import { LessonContentService } from './lesson-content.service';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  constructor(
    private auth: AuthService,
    private firestore: Firestore,
    private lessonContentService: LessonContentService,
    private quizService: QuizService,
  ) {}

  async addLesson(lesson: Partial<Lesson>): Promise<void> {
    const docRef = doc(collection(this.firestore, Collections.LESSONS));
    await setDoc(docRef, {
      ...lesson,
      id: docRef.id,
      createdAt: serverTimestamp(),
    });
  }

  async updateLesson(lesson: Lesson): Promise<void> {
    await updateDoc(doc(this.firestore, Collections.LESSONS, lesson.id), {
      ...lesson,
    });
  }

  async deleteLesson(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, Collections.LESSONS, id));
    await this.lessonContentService.deleteLessonContent(id);
    await this.quizService.deleteQuizByReferenceId(id);
  }

  getLesssonsByLevel(level: string): Observable<Lesson[]> {
    const collectionRef = collection(this.firestore, Collections.LESSONS);
    const collectionQueryRef = query(
      collectionRef,
      orderBy('createdAt', 'asc'),
      where('level', '==', level),
    );

    return collectionData(collectionQueryRef) as Observable<Lesson[]>;
  }

  getLessonsExtendedByLevel(level: string): Observable<LessonExtended[]> {
    return this.getLesssonsByLevel(level).pipe(
      mergeMap((lessons: Lesson[]) => {
        return forkJoin(
          lessons.map((lesson: Lesson) => {
            return this.lessonContentService
              .getContentByLessonId(lesson.id)
              .pipe(
                map((lessonContent: LessonContent) => ({
                  ...lesson,
                  ...lessonContent,
                })),
                take(1),
              );
          }),
        );
      }),
      take(1),
    );
  }

  getLessonsForUser(): Observable<LessonExtended[]> {
    return this.auth.currentUser$.pipe(
      filter(Boolean),
      switchMap((user: IUser) => {
        if (user.level) {
          return this.getLessonsExtendedByLevel(user.level);
        }

        return of([]) as Observable<LessonExtended[]>;
      }),
      take(1),
    );
  }

  getLessonById(id: string): Observable<Lesson> {
    const docRef = doc(this.firestore, Collections.LESSONS, id);
    return docData(docRef) as Observable<Lesson>;
  }
}
