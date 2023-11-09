import { Injectable } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, query, setDoc, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, first, map, of, switchMap } from 'rxjs';
import { IUser } from '../models/user.model';
import { AuthForm } from '../shared/components/auth-form/auth-form.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<IUser>;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    this.user$ = authState(this.auth).pipe(
      switchMap((user: User | null) => user ? this.getCurrentUser(user.email as string) : of(null)),
    ) as Observable<IUser>;
  }

  public async signUpWithEmailAndPassword({ displayName, email, password }: AuthForm): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const payload = { uid: userCredential.user.uid, displayName, email, photoURL: `https://ui-avatars.com/api/?name=${displayName}&size=128&bold=true` };

    await this.updateUser(payload);
    this.router.navigate(['/']);
  }

  public async signInWithEmailAndPassword({ email, password }: AuthForm): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/']);
  }

  public async signInWithProvider(providerType: SignInProviders): Promise<void> {
    const userCredential = await signInWithPopup(this.auth, providerType === SignInProviders.GOOGLE ? new GoogleAuthProvider() : new FacebookAuthProvider());
    const { email, photoURL, displayName, uid } = userCredential.user;
    const user = { email, photoURL, displayName, uid };

    await this.updateUser(user as IUser);
    this.router.navigate(['/']);
  }

  public signOut(): Promise<void> {
    this.router.navigate(['/login']);
    return this.auth.signOut();
  }

  public getCurrentUser(email: string): Observable<IUser> {
    const q = query(collection(this.firestore, 'users'), where('email', '==', email));
    return collectionData(q).pipe(
      first(),
      map((u) => u[0])
    ) as Observable<IUser>;
  }

  private async updateUser(user: IUser): Promise<IUser> {
    await setDoc(doc(this.firestore, 'users', user.uid), user, { merge: true });
    return user;
  }
}

export enum SignInProviders {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}
