import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export const languageKey = 'e-school:language';

export const getDefaultLanguage = (translate: TranslateService): string => {
  const language = localStorage.getItem(languageKey);

  if (language) {
    return language;
  }

  return translate.getBrowserLang() || 'uk';
};

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslateModule],
})
export class LanguageSelectorComponent {
  @Input() size = 36;
  @Input() withText = false;

  private translate = inject(TranslateService);
  public selectedLanguage = getDefaultLanguage(this.translate);

  onChangeLanguage(e: MouseEvent): void {
    const language = this.selectedLanguage === 'en' ? 'uk' : 'en';
    e.stopPropagation();

    localStorage.setItem(languageKey, language);
    this.selectedLanguage = language;
    this.translate.use(language);
  }
}
