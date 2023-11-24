import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '../page-layout/page-layout.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, RouterLink, TranslateModule],
})
export class FooterComponent {
  @Input() user: User | null;

  currentYear = new Date().getFullYear();
}
