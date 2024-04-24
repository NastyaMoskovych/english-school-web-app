import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {}

  auth() {
    return this.firebaseApp.auth();
  }

  firestore(): FirebaseFirestore.Firestore {
    return this.firebaseApp.firestore();
  }

  serverTimestamp(): Timestamp {
    return Timestamp.now();
  }
}
