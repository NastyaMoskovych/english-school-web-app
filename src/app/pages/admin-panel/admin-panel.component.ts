import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CardMenuItemComponent,
  MenuItem,
  PageLayoutComponent,
} from '@shared/components';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    PageLayoutComponent,
    TranslateModule,
    RouterLinkWithHref,
    CardMenuItemComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanelComponent {
  menuItems: MenuItem[] = [
    {
      backgroundColor: 'var(--palette-primary-color-3)',
      title: 'adminPanel.lessonsManagement.title',
      content: 'adminPanel.lessonsManagement.content',
      icon: 'play_lesson',
      url: ['lessons-management'],
    },
    {
      backgroundColor: 'var(--palette-primary-color-4)',
      title: 'adminPanel.users.title',
      content: 'adminPanel.users.content',
      icon: 'group',
      url: ['users'],
    },
    {
      backgroundColor: 'var(--palette-primary-color-2)',
      title: 'adminPanel.levelTestSetup.title',
      content: 'adminPanel.levelTestSetup.content',
      icon: 'quiz',
      url: ['level-test-setup'],
    },
  ];
}
