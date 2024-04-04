import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SwUpdate,
  VersionEvent,
  VersionReadyEvent,
} from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import {
  FooterComponent,
  HeaderComponent,
  SnackbarComponent,
  getDefaultLanguage,
} from '@shared/components';
import { IUser } from '@shared/models';
import { Observable, filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    SnackbarComponent,
  ],
})
export class AppComponent {
  public authService = inject(AuthService);
  public user$: Observable<IUser | null> = this.authService.user$;
  private swUpdate = inject(SwUpdate);

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang(getDefaultLanguage(this.translate));

    if (this.swUpdate.isEnabled) {
      this.initUpdate();
    }
  }

  private initUpdate(): void {
    this.swUpdate.versionUpdates
      .pipe(
        filter(
          (evt: VersionEvent): evt is VersionReadyEvent =>
            evt.type === 'VERSION_READY',
        ),
      )
      .subscribe(() => window.location.reload());
  }
}
