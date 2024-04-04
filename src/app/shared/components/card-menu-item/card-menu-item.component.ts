import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface MenuItem {
  title: string;
  icon: string;
  url: string[];
  backgroundColor?: string;
  content?: string;
}

@Component({
  selector: 'app-card-menu-item',
  standalone: true,
  imports: [RouterLinkWithHref, TranslateModule],
  templateUrl: './card-menu-item.component.html',
  styleUrl: './card-menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMenuItemComponent {
  @Input({ required: true }) menuItem: MenuItem;
}
