import { Firestore } from '@google-cloud/firestore';
import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirestoreService extends Firestore {
  constructor(@Inject('FIREBASE_APP') firebaseApp: app.App) {
    super();
    return firebaseApp.firestore();
  }
}
