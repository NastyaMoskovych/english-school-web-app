import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {}

  auth() {
    return this.firebaseApp.auth();
  }

  firestore(): FirebaseFirestore.Firestore {
    return this.firebaseApp.firestore();
  }
}
