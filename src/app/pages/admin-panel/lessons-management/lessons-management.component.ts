import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LessonsService } from '@app/services';
import { Lesson } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import {
  DropdownComponent,
  DropdownOption,
  LoaderComponent,
  PageLayoutComponent,
} from '@shared/components';
import { ENGLISH_LEVELS_OPTIONS } from '@shared/constants';
import { BehaviorSubject, Observable, filter, switchMap } from 'rxjs';
import {
  LessonModalComponent,
  LessonModalData,
} from './components/lesson-modal/lesson-modal.component';
import { LessonsManagementService } from './lessons-management.service';

@Component({
  selector: 'app-lessons-management',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslateModule,
    PageLayoutComponent,
    DropdownComponent,
    LessonModalComponent,
    LoaderComponent,
    RouterLinkWithHref,
  ],
  templateUrl: './lessons-management.component.html',
  styleUrl: './lessons-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsManagementComponent implements OnInit {
  private lessonsManagementService = inject(LessonsManagementService);
  private lessonsService = inject(LessonsService);

  levelsOptions = ENGLISH_LEVELS_OPTIONS;
  lessons$: Observable<Lesson[]>;
  lessonModalData$ = new BehaviorSubject<LessonModalData | undefined>(
    undefined,
  );

  get selectedLevelOption(): DropdownOption {
    return this.lessonsManagementService.selectedLevel$.getValue() as DropdownOption;
  }

  get selectedLevel(): string {
    return this.lessonsManagementService.selectedLevel$.getValue()
      ?.value as string;
  }

  ngOnInit(): void {
    this.lessons$ = this.lessonsManagementService.selectedLevel$.pipe(
      filter(Boolean),
      switchMap(({ value }) => this.lessonsService.getLesssonsByLevel(value)),
    );
  }

  onLevelSelect(level: DropdownOption): void {
    this.lessonsManagementService.selectedLevel$.next(level);
  }

  openAddLessonModal(): void {
    this.lessonModalData$.next({ mode: 'add' });
  }

  openEditLessonModal(event: MouseEvent, lesson: Lesson): void {
    event.stopPropagation();
    this.lessonModalData$.next({ mode: 'edit', lesson });
  }

  openRemoveLessonModal(event: MouseEvent, lesson: Lesson): void {
    event.stopPropagation();
    this.lessonModalData$.next({ mode: 'delete', lesson });
  }

  onLessonModalClose(): void {
    this.lessonModalData$.next(undefined);
  }

  async onSubmitLesson(data: LessonModalData): Promise<void> {
    const { lesson, mode } = data;

    if (!lesson) {
      return;
    }

    if (mode === 'add') {
      await this.lessonsService.addLesson({
        title: lesson.title,
        level: this.selectedLevel,
      });
    } else if (mode === 'edit') {
      await this.lessonsService.updateLesson(lesson);
    } else if (mode === 'delete') {
      await this.lessonsService.deleteLesson(lesson.id);
    }

    this.lessonModalData$.next(undefined);
  }
}
