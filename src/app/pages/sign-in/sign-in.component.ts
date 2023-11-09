import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthError } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthForm, AuthType } from '../../shared/components/auth-form/auth-form.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  authType = AuthType.Login;
  authService = inject(AuthService);

  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<AuthError | null>(null);

  onSignInWithEmailAndPassword(authForm: AuthForm) {
    this.loading$.next(true);
    this.authService.signInWithEmailAndPassword(authForm)
      .catch(error => this.error$.next(error))
      .finally(() => this.loading$.next(false));
  }
}
