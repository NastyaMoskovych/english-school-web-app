import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Collections } from '../shared/models';
import { IUser } from './user.model';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async updateUser(payload: Partial<IUser>, uid: string): Promise<void> {
    await this.firebaseService
      .firestore()
      .collection(Collections.USERS)
      .doc(uid)
      .set(payload, { merge: true });
  }
}
