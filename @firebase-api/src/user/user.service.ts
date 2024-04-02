import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
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

  async updateUser(payload: Partial<IUser>, uid: string): Promise<void> {
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
}
