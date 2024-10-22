import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ENGLISH_LEVELS } from '../shared/constants';
import { Collections, EnglishLevel } from '../shared/models';
import { IUser } from './user.model';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async getUser(uid: string): Promise<IUser> {
    const snapshot = await this.firebaseService
      .firestore()
      .collection(Collections.USERS)
      .doc(uid)
      .get();

    return snapshot.data() as IUser;
  }

  async getGuestLevel(sessionId: string): Promise<EnglishLevel> {
    const ref = this.firebaseService
      .firestore()
      .collection(Collections.SESSION)
      .doc(sessionId);

    const snapshot = await ref.get();

    if (snapshot.exists) {
      const level = snapshot.data().level;

      await ref.delete();
      return level;
    }

    return null;
  }

  async updateUser(
    payload: Partial<IUser>,
    uid: string,
    sessionId?: string,
  ): Promise<void> {
    if (sessionId) {
      const level = await this.getGuestLevel(sessionId);

      if (level) {
        Object.assign(payload, { level });
      }
    }

    await this.firebaseService
      .firestore()
      .collection(Collections.USERS)
      .doc(uid)
      .set(payload, { merge: true });
  }

  async updateUserLevel(level: EnglishLevel, uid: string): Promise<void> {
    const user = await this.getUser(uid);

    if (!user.level) {
      await this.updateUser({ level }, uid);
    } else {
      throw new BadRequestException(`${uid} user cannot retake the test.`);
    }
  }

  async saveLevelForGuest(level: EnglishLevel): Promise<string> {
    const docRef = await this.firebaseService
      .firestore()
      .collection(Collections.SESSION)
      .add({ level, type: 'GUEST' });

    return docRef.id;
  }

  async increaseUserLevel(
    uid: string,
    lessonLevel: EnglishLevel,
  ): Promise<EnglishLevel> {
    const nextLevel =
      ENGLISH_LEVELS[ENGLISH_LEVELS.indexOf(lessonLevel) + 1] ||
      ENGLISH_LEVELS[ENGLISH_LEVELS.length - 1];
    const currentUserLevel = (await this.getUser(uid)).level;
    const nextLevelIdx = ENGLISH_LEVELS.indexOf(nextLevel);
    const currentLevelIdx = ENGLISH_LEVELS.indexOf(currentUserLevel);

    if (
      nextLevelIdx > currentLevelIdx &&
      nextLevelIdx - currentLevelIdx === 1
    ) {
      await this.updateUser({ level: nextLevel }, uid);
      return nextLevel;
    }
  }
}
