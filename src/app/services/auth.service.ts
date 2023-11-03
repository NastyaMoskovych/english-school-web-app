import { Injectable } from '@angular/core';
import { Auth, FacebookAuthProvider, GoogleAuthProvider, User, UserCredential, authState, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    this.user$ = authState(this.auth) as Observable<User>;
  }

  public async signInWithProvider(providerType: SignInProviders): Promise<UserCredential> {
    const userCredential = await signInWithPopup(this.auth, providerType === SignInProviders.GOOGLE ? new GoogleAuthProvider() : new FacebookAuthProvider());
    const { email, photoURL, displayName, uid } = userCredential.user;
    const user = { email, photoURL, displayName };

    this.router.navigate(['/']);
    await setDoc(doc(this.firestore, 'users', uid), user, { merge: true });

    return userCredential;
  }

  public signOut(): Promise<void> {
    this.router.navigate(['/login']);
    return this.auth.signOut();
  }
}

export enum SignInProviders {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}
