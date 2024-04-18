import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import {
  CardMenuItemComponent,
  LoaderComponent,
  PageLayoutComponent,
} from '@app/shared/components';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, map } from 'rxjs';
import { LessonsService, UsersService } from '../../services';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [
    PageLayoutComponent,
    TranslateModule,
    AsyncPipe,
    CardMenuItemComponent,
    LoaderComponent,
  ],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent {
  @ViewChild(PageLayoutComponent) pageLayout: PageLayoutComponent;

  private translate = inject(TranslateService);

  lessons$ = forkJoin([
    inject(LessonsService).getLessonsForUser(),
    inject(UsersService).getCurrentUserLevel(),
  ]).pipe(
    map(([lessons, level]) => {
      this.pageLayout.setTitle(
        this.translate.instant('learn.title', { level }),
      );

      return lessons;
    }),
  );
}
