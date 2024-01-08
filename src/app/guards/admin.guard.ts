import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const isAdmin$ = inject(AuthService).isAdmin$;
  const router = inject(Router);

  return isAdmin$.pipe(
    filter((state: boolean | null) => state !== null),
    map((state: boolean | null) => {
      if (!state) {
        router.navigate(['/']);
      }

      return !!state;
    }),
  );
};
