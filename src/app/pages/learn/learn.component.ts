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
import { ENGLISH_LEVELS_OPTIONS } from '@app/shared/constants';
import { DropdownOptionsPipe } from '@app/shared/pipes';
import { ENGLISH_LEVELS } from '@firebase-api/constants';
import { EnglishLevel, Lesson } from '@firebase-api/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  debounceTime,
  map,
  switchMap,
} from 'rxjs';
import { LessonsService } from '../../services';

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
  private selectedLevel: EnglishLevel;

  levelsOptions: DropdownOption[];

  selectedLevel$ = new BehaviorSubject<DropdownOption | null>(null);
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

  onLevelSelect(level: DropdownOption): void {
    this.selectedLevel$.next(level);
  }

  private getLessonsForUser(): Observable<Lesson[]> {
    return this.selectedLevel$.pipe(
      debounceTime(100),
      switchMap((option: DropdownOption | null) => {
        if (!this.selectedLevel || option?.value !== this.selectedLevel) {
          return this.lessonsService.getLessonsForUser(
            option?.value as EnglishLevel,
          );
        }
        return EMPTY;
      }),
      map(({ lessons, level, userLevel }) => {
        if (level) {
          this.setPageTitle(level);
          this.setSelectedLevel(level, userLevel);
          this.selectedLevel = level;
        }

        this.setSelectedStatus(lessons);

        return lessons;
      }),
    );
  }

  private setPageTitle(level: string): void {
    this.pageLayout.setTitle(this.translate.instant('learn.title', { level }));
  }

  private setSelectedLevel(level: EnglishLevel, userLevel: EnglishLevel): void {
    this.levelsOptions = ENGLISH_LEVELS_OPTIONS.filter(({ value }) => {
      return (
        ENGLISH_LEVELS.indexOf(value as EnglishLevel) <=
        ENGLISH_LEVELS.indexOf(userLevel)
      );
    });

    if (!this.selectedLevel$.getValue()?.value) {
      this.selectedLevel$.next({
        label: level,
        value: level,
      });
    }
  }

  private setSelectedStatus(lessons: Lesson[]): void {
    if (lessons.filter((lesson) => !lesson.completed).length === 0) {
      this.selectedStatus$.next({
        label: this.translate.instant('general.dropdown.statuses.all'),
        value: 'all',
      });
    }
  }
}
