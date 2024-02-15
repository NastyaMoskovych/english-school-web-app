import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Collections } from '@firebase-api/models';
import { IUser, UserMetadata } from '@shared/models';
import { Observable, forkJoin, from, map, mergeMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private authService: AuthService,
    private firestore: Firestore,
  ) {}

  getAllUsers(): Observable<IUser[]> {
    const usersCollectionRef = collection(this.firestore, Collections.USERS);
    const usersQueryRef = query(
      usersCollectionRef,
      orderBy('displayName', 'asc'),
    );

    return collectionData(usersQueryRef).pipe(
      map((data) => data as IUser[]),
      mergeMap((users: IUser[]) => {
        return forkJoin(
          users.map((user: IUser) => {
            return from(this.authService.getUserMetadata(user)).pipe(
              map((metadata: UserMetadata) => ({
                ...user,
                isAdmin: metadata.role === 'ADMIN',
              })),
            );
          }),
        );
      }),
      take(1),
    );
  }
}
