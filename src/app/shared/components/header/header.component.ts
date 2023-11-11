import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '../../../models/user.model';
import { fadeAnimation } from '../../animations/fade.animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation],
})
export class HeaderComponent {
  @Input() user: IUser | null;
  @Output() signOut = new EventEmitter<void>();

  accountMenuVisible = false;

  onAccountMenuHover(visible: boolean): void {
    if (visible && window.innerWidth < 768) {
      return;
    }

    this.accountMenuVisible = visible;
  }
}
