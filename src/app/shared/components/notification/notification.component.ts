import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  @Input({ required: true }) message: string;
  @Input() icon: string;
}
