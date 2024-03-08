import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  AuthErrorCodes,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  authState,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadString,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Collections } from '@firebase-api/models';
import { IUser, UserMetadata } from '@shared/models';
import { BehaviorSubject, tap } from 'rxjs';
import { IChangePasswordPayload } from '../pages/my-account/update-profile/components/change-password-form/change-password-form.component';
import { IUpdateProfilePayload } from '../pages/my-account/update-profile/components/update-profile-form/update-profile-form.component';
import { AuthForm } from '../shared/components/auth-form/auth-form.component';
import { getTypeFromBase64 } from '../shared/utils';
import { SnackbarMessages, SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly canChangePassword = new BehaviorSubject<boolean>(false);
  private readonly isAdmin = new BehaviorSubject<boolean | null>(null);

  public readonly authState$ = authState(this.auth);
  public readonly isAdmin$ = this.isAdmin.asObservable();
  public readonly user$ = new BehaviorSubject<IUser | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private storage: Storage,
    private snackbar: SnackbarService,
  ) {
    this.authState$
      .pipe(
        tap((user: User | null) => {
          if (!user || !user.emailVerified) {
            this.canChangePassword.next(false);
            this.isAdmin.next(null);
            return this.user$.next(null);
          }

          if (!this.canChangePassword.value) {
            getIdTokenResult(user).then(({ signInProvider }) => {
              const canChangePassword = signInProvider === 'password';
              this.canChangePassword.next(canChangePassword);
              this.user$.next({
                ...(this.user$.value as IUser),
                canChangePassword,
              });
            });
          }

          if (!this.isAdmin.value) {
            this.getUserMetadata(user).then(({ role }) => {
              const isAdmin = role === 'ADMIN';
              this.isAdmin.next(isAdmin);
              this.user$.next({ ...(this.user$.value as IUser), isAdmin });
            });
          }
          this.user$.next(user);
        }),
      )
      .subscribe();
  }

  public async signUpWithEmailAndPassword({
    displayName,
    email,
    password,
  }: AuthForm): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    const payload = {
      uid: userCredential.user.uid,
      displayName,
      email,
      photoURL: null,
    };

    await sendEmailVerification(userCredential.user);
    await updateProfile(userCredential.user, payload);
    await this.updateUsersDocument(payload.uid, payload);
    this.snackbar.show({ message: SnackbarMessages.REGISTER_SUCCESS });

    this.signOut();
  }

  public async signInWithEmailAndPassword({
    email,
    password,
  }: AuthForm): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    );

    if (userCredential.user.emailVerified) {
      this.router.navigate(['/']);
    } else {
      this.signOut();
      throw new FirebaseError(AuthErrorCodes.UNVERIFIED_EMAIL, '');
    }
  }

  public async signInWithProvider(
    providerType: SignInProviders,
  ): Promise<void> {
    const userCredential = await signInWithPopup(
      this.auth,
      providerType === SignInProviders.GOOGLE
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider(),
    );
    const { email, photoURL, displayName, uid } = userCredential.user;
    const document = (
      await getDoc(doc(this.firestore, Collections.USERS, uid))
    ).exists();

    if (!document) {
      const payload = {
        email,
        displayName,
        uid,
        photoURL,
      };
      await this.updateUsersDocument(payload.uid, payload);
    }

    this.router.navigate(['/my-account']);
  }

  public signOut(): Promise<void> {
    this.router.navigate(['/login']);
    return this.auth.signOut();
  }

  public async updateProfile({
    displayName,
    imageData,
    uid,
  }: IUpdateProfilePayload): Promise<void> {
    const payload: Partial<User> = { displayName };
    const user = this.auth.currentUser as User;

    if (imageData) {
      const storageRef = ref(
        this.storage,
        `images/users/${uid}/photo-${Date.now()}.${getTypeFromBase64(
          imageData,
        )}`,
      );
      await uploadString(storageRef, imageData, 'data_url');

      Object.assign(payload, {
        photoURL: await getDownloadURL(storageRef),
      });
    }

    await updateProfile(user, payload);
    await this.updateUsersDocument(uid, payload);
    this.snackbar.show({ message: SnackbarMessages.UPDATE_PROFILE_SUCCESS });
    this.user$.next({ ...(this.user$.value as User), ...payload });
  }

  public async updateUsersDocument(
    uid: string,
    user: Partial<User>,
  ): Promise<void> {
    await setDoc(doc(this.firestore, Collections.USERS, uid), user, {
      merge: true,
    });
  }

  public async changePassword({
    newPassword,
    currentPassword,
  }: IChangePasswordPayload): Promise<void> {
    const user: User = this.auth.currentUser as User;

    if (user) {
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email as string, currentPassword),
      );
      await updatePassword(user, newPassword);
      this.snackbar.show({ message: SnackbarMessages.CHANGE_PASSWORD_SUCCESS });
    }
  }

  public async getUserMetadata(user: User): Promise<UserMetadata> {
    const document = await getDoc(
      doc(this.firestore, Collections.METADATA, user.uid),
    );
    return (document.data() as UserMetadata) || {};
  }
}

export enum SignInProviders {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}
