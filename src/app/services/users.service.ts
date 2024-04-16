import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Collections, EnglishLevel } from '@firebase-api/models';
import { IUser, UserMetadata } from '@shared/models';
import { Observable, filter, forkJoin, from, map, mergeMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private authService: AuthService,
    private firestore: Firestore,
  ) {}

  getCurrentUserLevel(): Observable<EnglishLevel | undefined> {
    return this.authService.currentUser$.pipe(
      filter(Boolean),
      map((user: IUser) => user.level),
      take(1),
    );
  }

  getAllUsers(): Observable<IUser[]> {
    const usersCollectionRef = collection(this.firestore, Collections.USERS);
    const usersQueryRef = query(
      usersCollectionRef,
      orderBy('displayName', 'asc'),
    );

    return from(getDocs(usersQueryRef)).pipe(
      mergeMap(({ docs }) =>
        forkJoin(
          docs.map((doc) => {
            const user = doc.data() as IUser;

            return from(this.authService.getUserMetadata(user)).pipe(
              map((metadata: UserMetadata) => ({
                ...user,
                isAdmin: metadata.role === 'ADMIN',
              })),
            );
          }),
        ),
      ),
    );
  }
}
