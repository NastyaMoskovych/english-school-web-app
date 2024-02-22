import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ConfigEnum } from '../shared/models';
import { FirebaseService } from './firebase.service';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const FIREBASE_SERVICE_ACCOUNT_KEY = configService.get<string>(
      ConfigEnum.FIREBASE_SERVICE_ACCOUNT_KEY,
    );

    const firebaseConfig = JSON.parse(
      Buffer.from(FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('ascii'),
    );

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
