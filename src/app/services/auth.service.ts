import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  AuthErrorCodes,
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  authState,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, getDoc, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, of, shareReplay, switchMap } from 'rxjs';
import { IUser } from '../models/user.model';
import { AuthForm } from '../shared/components/auth-form/auth-form.component';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly canChangePassword = new BehaviorSubject<boolean>(false);

  public readonly authState$ = authState(this.auth);
  public readonly canChangePassword$ = this.canChangePassword.asObservable();
  public readonly user$: Observable<IUser | null>;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router, private userService: UserService) {
    this.user$ = authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (!user || !user.emailVerified) {
          this.canChangePassword.next(false);
          return of(null);
        }

        if (!this.canChangePassword.value) {
          getIdTokenResult(user).then(({ signInProvider }) => this.canChangePassword.next(signInProvider === 'password'));
        }

        return this.getCurrentUser(user.email as string);
      }),
      shareReplay(),
    );
  }

  public async signUpWithEmailAndPassword({ displayName, email, password }: AuthForm): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const payload = { uid: userCredential.user.uid, displayName, email, photoURL: null };

    await sendEmailVerification(userCredential.user);
    await this.userService.updateUser(payload.uid, payload);

    this.signOut();
  }

  public async signInWithEmailAndPassword({ email, password }: AuthForm): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

    if (userCredential.user.emailVerified) {
      this.router.navigate(['/']);
    } else {
      this.signOut();
      throw new FirebaseError(AuthErrorCodes.UNVERIFIED_EMAIL, '');
    }
  }

  public async signInWithProvider(providerType: SignInProviders): Promise<void> {
    const userCredential = await signInWithPopup(this.auth, providerType === SignInProviders.GOOGLE ? new GoogleAuthProvider() : new FacebookAuthProvider());
    const { email, photoURL, displayName, uid } = userCredential.user;
    const document = (await getDoc(doc(this.firestore, 'users', uid))).exists();

    if (!document) {
      const payload = { email, displayName, uid, photoURL: photoURL?.replaceAll('s96-c', 's256-c') } as IUser;
      await this.userService.updateUser(payload.uid, payload);
    }

    this.router.navigate(['/']);
  }

  public signOut(): Promise<void> {
    this.router.navigate(['/login']);
    return this.auth.signOut();
  }

  public getCurrentUser(email: string): Observable<IUser> {
    const q = query(collection(this.firestore, 'users'), where('email', '==', email));
    return collectionData(q).pipe(
      map((u) => u[0])
    ) as Observable<IUser>;
  }
}

export enum SignInProviders {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}
