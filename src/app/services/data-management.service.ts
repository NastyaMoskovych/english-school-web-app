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
import { Lesson } from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataManagementService {
  static readonly levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  constructor(private firestore: Firestore) {}

  async addLesson(lesson: Lesson): Promise<void> {
    const docRef = doc(collection(this.firestore, 'lessons'));
    await setDoc(docRef, {
      ...lesson,
      id: docRef.id,
      createdAt: serverTimestamp(),
    });
  }

  async updateLesson(lesson: Lesson): Promise<void> {
    await updateDoc(doc(this.firestore, 'lessons', lesson.id as string), {
      ...lesson,
    });
  }

  async deleteLesson(lesson: Lesson): Promise<void> {
    await deleteDoc(doc(this.firestore, 'lessons', lesson.id as string));
  }

  getLesssonsByLevel(level: string): Observable<Lesson[]> {
    const usersCollectionRef = collection(this.firestore, 'lessons');
    const usersQueryRef = query(
      usersCollectionRef,
      orderBy('createdAt', 'asc'),
      where('level', '==', level),
    );

    return collectionData(usersQueryRef) as Observable<Lesson[]>;
  }
}
