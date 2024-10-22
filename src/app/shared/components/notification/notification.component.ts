import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class NotificationComponent {
  @Input({ required: true }) message: string;
  @Input() extraMessage: string | undefined;
  @Input() type: 'success' | 'error' = 'error';
  @Input() closable = false;
  @Output() closeEvent = new EventEmitter<void>();
}
