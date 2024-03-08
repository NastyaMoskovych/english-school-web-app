import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CardMenuItemComponent,
  MenuItem,
  PageLayoutComponent,
} from '@shared/components';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    PageLayoutComponent,
    TranslateModule,
    RouterLinkWithHref,
    CardMenuItemComponent,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAccountComponent {
  menuItems: MenuItem[] = [
    {
      backgroundColor: 'var(--palette-primary-color-3)',
      content: 'myAccount.levelCheck.content',
      icon: 'quiz',
      title: 'myAccount.levelCheck.title',
      url: ['/level-check'],
    },
    {
      backgroundColor: 'var(--palette-primary-color-4)',
      content: 'myAccount.updateProfile.content',
      icon: 'manage_accounts',
      title: 'myAccount.updateProfile.title1',
      url: ['update-profile'],
    },
  ];
}
