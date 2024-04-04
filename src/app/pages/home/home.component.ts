import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '@shared/components';
import { AuthService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgOptimizedImage,
    PageLayoutComponent,
    RouterLink,
    TranslateModule,
    CommonModule,
  ],
})
export class HomeComponent {
  currentUser$ = inject(AuthService).currentUser$;
}
