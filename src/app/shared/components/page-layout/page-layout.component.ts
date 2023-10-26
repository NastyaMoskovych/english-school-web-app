import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
  @Input() backgroundColor = 'inherit';
  @Input() separator = false;
}
