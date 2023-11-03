import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  @Input() user: User | null;

  currentYear = new Date().getFullYear();
}
