import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '@shared/components';

interface MenuItem {
  title: string;
  content: string;
  icon: string;
  url: string[];
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [PageLayoutComponent, TranslateModule, RouterLinkWithHref],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanelComponent {
  menuItems: MenuItem[] = [
    {
      title: 'adminPanel.lessonsManagement.title',
      content: 'adminPanel.lessonsManagement.content',
      icon: 'play_lesson',
      url: ['lessons-management'],
    },
    {
      title: 'adminPanel.users.title',
      content: 'adminPanel.users.content',
      icon: 'group',
      url: ['users'],
    },
    {
      title: 'adminPanel.levelTestSetup.title',
      content: 'adminPanel.levelTestSetup.content',
      icon: 'quiz',
      url: ['level-test-setup'],
    },
  ];
}
