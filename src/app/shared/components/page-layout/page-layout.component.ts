import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
})
export class PageLayoutComponent {
  @Input() backgroundColor = 'inherit';
  @Input() separator = false;
  @Input() breadcrumbs = false;
  @Input() title: string;
}
