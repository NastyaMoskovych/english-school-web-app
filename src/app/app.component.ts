import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private languageKey = 'e-school:language';
  public selectedLanguage = this.getDefaultLanguage();

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'ua']);
    translate.setDefaultLang(this.getDefaultLanguage());
  }

  onChangeLanguage(language: string): void {
    localStorage.setItem(this.languageKey, language);
    this.selectedLanguage = language;
    this.translate.use(language);
  }

  private getDefaultLanguage(): string {
    const language = localStorage.getItem(this.languageKey);

    if (language) {
      return language;
    }

    return this.translate.getBrowserLang() || 'ua';
  }
}
