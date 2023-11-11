import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectorComponent {
  @Input() size = '36px';
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
