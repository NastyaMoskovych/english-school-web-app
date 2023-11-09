import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IUser } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private languageKey = 'e-school:language';
  public selectedLanguage = this.getDefaultLanguage();
  public authService = inject(AuthService);
  public user$: Observable<IUser> = this.authService.user$;

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang(this.getDefaultLanguage());
  }

  ngOnInit(): void {
    this.user$.subscribe((user: IUser) => console.log(user));
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

    return this.translate.getBrowserLang() || 'uk';
  }
}
