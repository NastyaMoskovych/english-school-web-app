import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  FooterComponent,
  HeaderComponent,
  SnackbarComponent,
  getDefaultLanguage,
} from '@shared/components';
import { IUser } from '@shared/models';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    SnackbarComponent,
  ],
})
export class AppComponent {
  public authService = inject(AuthService);
  public user$: Observable<IUser | null> = this.authService.user$;

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang(getDefaultLanguage(this.translate));
  }
}
