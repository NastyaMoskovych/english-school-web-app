import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '@shared/components';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TranslateModule,
    RouterLinkWithHref,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanelComponent {}
