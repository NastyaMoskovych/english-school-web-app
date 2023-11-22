import { Injectable } from '@angular/core';
import { Auth, EmailAuthProvider, User, authState, reauthenticateWithCredential, updatePassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { first } from 'rxjs/operators';
import { IUser } from '../models/user.model';
import { IChangePasswordPayload } from '../pages/update-profile/components/change-password-form/change-password-form.component';
import { IUpdateProfilePayload } from '../pages/update-profile/components/update-profile-form/update-profile-form.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {
  }

  async updateProfile({ displayName, file, uid }: IUpdateProfilePayload): Promise<void> {
    const payload: Partial<IUser> = { displayName };

    if (file) {
      const storageRef = ref(this.storage, `images/users/${uid}/photo.${file.type.split('/').pop()}`);
      await uploadBytes(storageRef, file);

      Object.assign(payload, {
        photoURL: await getDownloadURL(storageRef),
      });
    }

    await this.updateUser(uid, payload);
  }

  async updateUser(uid: string, user: Partial<IUser>): Promise<void> {
    await setDoc(doc(this.firestore, 'users', uid), user, { merge: true });
  }

  async changePassword({ newPassword, currentPassword }: IChangePasswordPayload): Promise<void> {
    const user: User = await (authState(this.auth).pipe(first()).toPromise()) as User;

    if (user) {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email as string, currentPassword))
      await updatePassword(user, newPassword);
    }
  }
}
