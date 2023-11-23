import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthError } from '@angular/fire/auth';
import {
  AuthForm,
  AuthFormComponent,
  AuthType,
  PageLayoutComponent,
} from '@shared/components';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, AuthFormComponent],
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
