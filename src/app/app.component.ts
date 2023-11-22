import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IUser } from './models/user.model';
import { AuthService } from './services/auth.service';
import { getDefaultLanguage } from './shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public authService = inject(AuthService);
  public user$: Observable<IUser | null> = this.authService.user$;

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang(getDefaultLanguage(this.translate));
  }
}
