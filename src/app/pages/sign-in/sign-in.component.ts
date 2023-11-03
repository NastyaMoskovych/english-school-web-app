import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthType } from '../../shared/components/auth-form/auth-form.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  authType = AuthType.Login;
  authService = inject(AuthService);
}
