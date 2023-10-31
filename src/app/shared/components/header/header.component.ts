import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() selectedLanguage: string;
  @Output() changeLanguage = new EventEmitter<string>();

  onChangeLanguage(): void {
    const nextLanguage = this.selectedLanguage === 'en' ? 'ua' : 'en';
    this.changeLanguage.emit(nextLanguage);
  }
}
