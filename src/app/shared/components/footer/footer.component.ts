import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IUser } from '../../../models/user.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  @Input() user: IUser | null;

  currentYear = new Date().getFullYear();
}
