import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SignInProviders } from '../../../services/auth.service';

export enum AuthType {
  Login = 'login',
  Signup = 'signup',
}

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent {
  @Input({ required: true }) authType: AuthType;
  @Output() signInWithProvider = new EventEmitter<SignInProviders>();

  signInProviders = SignInProviders;

  get isSignUp(): boolean {
    return this.authType === AuthType.Signup;
  }
}
