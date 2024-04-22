import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import {
  CardMenuItemComponent,
  DropdownComponent,
  DropdownOption,
  LoaderComponent,
  PageLayoutComponent,
} from '@app/shared/components';
import { DropdownOptionsPipe } from '@app/shared/pipes';
import { Lesson } from '@firebase-api/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  forkJoin,
  map,
} from 'rxjs';
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
    DropdownComponent,
    DropdownOptionsPipe,
  ],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent {
  @ViewChild(PageLayoutComponent) pageLayout: PageLayoutComponent;

  private lessonsService = inject(LessonsService);
  private translate = inject(TranslateService);
  private usersService = inject(UsersService);

  selectedStatus$ = new BehaviorSubject<DropdownOption | undefined>(undefined);

  lessons$ = combineLatest([
    this.getLessonsForUser(),
    this.selectedStatus$,
  ]).pipe(
    map(([lessons, selectedStatus]) => {
      if (selectedStatus) {
        return lessons.filter((lesson) => {
          if (selectedStatus.value === 'completed') {
            return lesson.completed;
          }

          if (selectedStatus.value === 'incompleted') {
            return !lesson.completed;
          }

          return true;
        });
      }

      return lessons;
    }),
  );

  onStatusSelect(status: DropdownOption): void {
    this.selectedStatus$.next(status);
  }

  private getLessonsForUser(): Observable<Lesson[]> {
    return forkJoin([
      this.lessonsService.getLessonsForUser(),
      this.usersService.getCurrentUserLevel(),
    ]).pipe(
      map(([lessons, level]) => {
        this.pageLayout.setTitle(
          this.translate.instant('learn.title', { level }),
        );

        return lessons;
      }),
    );
  }
}
