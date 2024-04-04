import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AuthError } from '@angular/fire/auth';
import { AuthService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '@shared/components';
import {
  ChangePasswordFormComponent,
  IChangePasswordPayload,
} from './components/change-password-form/change-password-form.component';
import {
  IUpdateProfilePayload,
  UpdateProfileFormComponent,
} from './components/update-profile-form/update-profile-form.component';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    UpdateProfileFormComponent,
    ChangePasswordFormComponent,
    TranslateModule,
  ],
})
export class UpdateProfileComponent {
  public authService = inject(AuthService);

  updateProfileLoading = signal<boolean>(false);
  changePasswordLoading = signal<boolean>(false);
  changePasswordError = signal<AuthError | null>(null);

  onUpdateProfile(payload: IUpdateProfilePayload): void {
    this.updateProfileLoading.set(true);

    this.authService
      .updateProfile(payload)
      .finally(() => this.updateProfileLoading.set(false));
  }

  onChangePassword(payload: IChangePasswordPayload): void {
    this.changePasswordLoading.set(true);

    this.authService
      .changePassword(payload)
      .catch((error) => this.changePasswordError.set(error))
      .finally(() => this.changePasswordLoading.set(false));
  }
}
