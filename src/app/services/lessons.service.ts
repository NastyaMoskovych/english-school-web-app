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
import { Observable } from 'rxjs';
import { Collections, Lesson, LessonPayload } from '../shared/models';
import { LessonContentService } from './lesson-content.service';

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  constructor(
    private firestore: Firestore,
    private lessonContentService: LessonContentService,
  ) {}

  async addLesson(lesson: LessonPayload): Promise<void> {
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

  getLessonById(id: string): Observable<Lesson> {
    const docRef = doc(this.firestore, Collections.LESSONS, id);
    return docData(docRef) as Observable<Lesson>;
  }
}