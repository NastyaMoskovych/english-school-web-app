import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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

  get isSignUp(): boolean {
    return this.authType === AuthType.Signup;
  }
}
