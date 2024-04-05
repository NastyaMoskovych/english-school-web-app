import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CardMenuItemComponent,
  LevelStatusComponent,
  MenuItem,
  PageLayoutComponent,
} from '@shared/components';
import { AuthService } from '../../services';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    AsyncPipe,
    PageLayoutComponent,
    TranslateModule,
    RouterLinkWithHref,
    CardMenuItemComponent,
    LevelStatusComponent,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAccountComponent {
  currentUser$ = inject(AuthService).currentUser$;

  menuItems: { [key: string]: MenuItem } = {
    checkLevel: {
      backgroundColor: 'var(--palette-primary-color-3)',
      content: 'myAccount.levelCheck.content',
      icon: 'quiz',
      title: 'myAccount.levelCheck.title',
      url: ['/level-check'],
    },
    continueLearning: {
      backgroundColor: 'var(--palette-primary-color-3)',
      icon: 'school',
      title: 'myAccount.continueLearning.title',
      url: ['/learn'],
    },
    updateProfile: {
      backgroundColor: 'var(--palette-primary-color-4)',
      content: 'myAccount.updateProfile.content',
      icon: 'manage_accounts',
      title: 'myAccount.updateProfile.title1',
      url: ['update-profile'],
    },
  };
}
