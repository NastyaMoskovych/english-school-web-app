import { User } from '@angular/fire/auth';
import { EnglishLevel } from '@firebase-api/models';

export interface UserMetadata {
  role?: 'ADMIN' | null;
}

export interface IUser extends User {
  isAdmin?: boolean;
  canChangePassword?: boolean;
  level?: EnglishLevel;
}
