import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { from, switchMap, take } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthService).authState$;

  if (!req.url.includes('/api')) {
    return next(req);
  }

  return authState.pipe(
    take(1),
    switchMap((user: User | null) => {
      if (user) {
        return from(user.getIdToken());
      }

      return of(undefined);
    }),
    switchMap((token: string | undefined) => {
      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }

      return next(req);
    }),
  );
};
