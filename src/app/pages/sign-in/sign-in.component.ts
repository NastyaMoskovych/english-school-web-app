import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthError } from '@angular/fire/auth';
import { AuthService } from '@app/services';
import {
  AuthForm,
  AuthFormComponent,
  AuthType,
  PageLayoutComponent,
} from '@shared/components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, PageLayoutComponent, AuthFormComponent],
})
export class SignInComponent {
  authType = AuthType.Login;
  authService = inject(AuthService);

  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<AuthError | null>(null);

  onSignInWithEmailAndPassword(authForm: AuthForm) {
    this.loading$.next(true);
    this.authService
      .signInWithEmailAndPassword(authForm)
      .catch((error) => this.error$.next(error))
      .finally(() => this.loading$.next(false));
  }
}
