import { User } from '@angular/fire/auth';

export interface UserMetadata {
  role?: 'ADMIN' | null;
}

export interface IUser extends User {
  isAdmin?: boolean;
  canChangePassword?: boolean;
}
