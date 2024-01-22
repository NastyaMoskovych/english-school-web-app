import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
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

  private cdr = inject(ChangeDetectorRef);

  setTitle(title: string): void {
    this.title = title;
    this.cdr.markForCheck();
  }
}
