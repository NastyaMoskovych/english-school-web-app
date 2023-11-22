import { inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthService).authState$;
  const router = inject(Router);

  return authState.pipe(
    map((user: User | null) => {
      if (user) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    }),
  );
};
