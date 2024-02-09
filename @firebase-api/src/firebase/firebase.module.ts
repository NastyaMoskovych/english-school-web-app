import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirestoreService } from './firestore.service';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const FIREBASE_SERVICE_ACCOUNT_KEY = configService.get(
      'FIREBASE_SERVICE_ACCOUNT_KEY',
    );
    const firebaseConfig = JSON.parse(
      Buffer.from(FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('ascii'),
    ) as admin.ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirestoreService],
  exports: [FirestoreService],
})
export class FirebaseModule {}
