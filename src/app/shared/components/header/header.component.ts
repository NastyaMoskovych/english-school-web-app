import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { fadeAnimation } from '@shared/animations';
import { IUser } from '@shared/models';
import { PhotoUrlPipe } from '@shared/pipes';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LanguageSelectorComponent,
    TranslateModule,
    PhotoUrlPipe,
  ],
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
