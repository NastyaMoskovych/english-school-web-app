import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
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
export class PageLayoutComponent implements OnInit {
  @Input() backgroundColor = 'var(--palette-primary-color-2)';
  @Input() separator = false;
  @Input() breadcrumbs = false;
  @Input() title: string;

  private cdr = inject(ChangeDetectorRef);
  private document = inject(DOCUMENT);

  ngOnInit(): void {
    this.setMainBackgrounColor();
  }

  setTitle(title: string): void {
    this.title = title;
    this.cdr.markForCheck();
  }

  private setMainBackgrounColor(): void {
    const main = this.document
      .getElementsByTagName('main')
      .item(0) as HTMLElement;

    if (main) {
      main.style.backgroundColor = this.backgroundColor;
    }
  }
}
