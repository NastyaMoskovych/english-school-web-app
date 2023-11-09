import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthError } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthForm, AuthType } from '../../shared/components/auth-form/auth-form.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  authType = AuthType.Signup;
  authService = inject(AuthService);

  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<AuthError | null>(null);

  onSignUpWithEmailAndPassword(authForm: AuthForm) {
    this.loading$.next(true);
    this.authService.signUpWithEmailAndPassword(authForm)
      .catch(error => this.error$.next(error))
      .finally(() => this.loading$.next(false));
  }
}
