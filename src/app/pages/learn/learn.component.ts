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
  NotificationComponent,
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
    NotificationComponent,
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

  selectedStatus$ = new BehaviorSubject<DropdownOption>({
    label: this.translate.instant('general.dropdown.statuses.incompleted'),
    value: 'incompleted',
  });

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

  get emptyResultsMessage(): string {
    const { value } = this.selectedStatus$.value;
    return `learn.lessons.empty.${value}`;
  }

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

        if (lessons.filter((lesson) => !lesson.completed).length === 0) {
          this.selectedStatus$.next({
            label: this.translate.instant('general.dropdown.statuses.all'),
            value: 'all',
          });
        }

        return lessons;
      }),
    );
  }
}
