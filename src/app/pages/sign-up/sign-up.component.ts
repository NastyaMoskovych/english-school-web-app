import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthType } from '../../shared/components/auth-form/auth-form.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  authType = AuthType.Signup;
}
