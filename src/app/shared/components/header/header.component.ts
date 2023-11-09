import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() user: IUser | null;
  @Input() selectedLanguage: string;
  @Output() changeLanguage = new EventEmitter<string>();
  @Output() signOut = new EventEmitter<void>();

  onChangeLanguage(): void {
    const nextLanguage = this.selectedLanguage === 'en' ? 'uk' : 'en';
    this.changeLanguage.emit(nextLanguage);
  }
}
