import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  public authService = inject(AuthService);
  public user$: Observable<IUser> = this.authService.user$;

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang(getDefaultLanguage(this.translate));
  }

  ngOnInit(): void {
    this.user$.subscribe((user: IUser) => console.log(user));
  }
}
