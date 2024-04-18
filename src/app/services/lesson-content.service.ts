import { Injectable } from '@angular/core';
import {
  Firestore,
  deleteDoc,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Storage, deleteObject, listAll, ref } from '@angular/fire/storage';
import { Collections, LessonContent } from '@firebase-api/models';
import { Observable } from 'rxjs';
import { SnackbarMessages, SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class LessonContentService {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private snackbar: SnackbarService,
  ) {}

  getContentByLessonId(lessonId: string): Observable<LessonContent> {
    const docRef = doc(this.firestore, Collections.LESSON_RESOURCES, lessonId);
    return docData(docRef) as Observable<LessonContent>;
  }

  async updateLessonContent(
    lessonId: string,
    content: LessonContent,
  ): Promise<void> {
    await setDoc(
      doc(this.firestore, Collections.LESSON_RESOURCES, lessonId),
      {
        ...content,
        lessonId,
      },
      { merge: true },
    );

    this.snackbar.show({ message: SnackbarMessages.UPDATE_SUCCESS });
  }

  async deleteLessonContent(id: string): Promise<void> {
    const imagesList = await listAll(ref(this.storage, `images/lessons/${id}`));

    await deleteDoc(doc(this.firestore, Collections.LESSON_RESOURCES, id));
    await Promise.all(imagesList.items.map((item) => deleteObject(item)));
  }
}
