import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DropdownComponent,
  DropdownOption,
  LoaderComponent,
  PageLayoutComponent,
} from '@shared/components';
import { Lesson } from '@shared/models';
import { BehaviorSubject, Observable, filter, switchMap } from 'rxjs';
import { DataManagementService } from '../../../services/data-management.service';
import {
  LessonModalComponent,
  LessonModalData,
} from './components/lesson-modal/lesson-modal.component';

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
  ],
  templateUrl: './lessons-management.component.html',
  styleUrl: './lessons-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsManagementComponent implements OnInit {
  private dataManagementService = inject(DataManagementService);

  levelsOptions = DataManagementService.levels.map((level) => ({
    value: level,
    label: level,
  }));

  lessons$: Observable<Lesson[]>;
  selectedLevel$ = new BehaviorSubject<DropdownOption | undefined>(undefined);
  lessonModalData$ = new BehaviorSubject<LessonModalData | undefined>(
    undefined,
  );

  get selectedLevel(): string {
    return this.selectedLevel$.getValue()?.value as string;
  }

  ngOnInit(): void {
    this.lessons$ = this.selectedLevel$.pipe(
      filter(Boolean),
      switchMap(({ value }) =>
        this.dataManagementService.getLesssonsByLevel(value),
      ),
    );
  }

  onLevelSelect(level: DropdownOption): void {
    this.selectedLevel$.next(level);
  }

  openAddLessonModal(): void {
    this.lessonModalData$.next({ mode: 'add' });
  }

  openEditLessonModal(lesson: Lesson): void {
    this.lessonModalData$.next({ mode: 'edit', lesson });
  }

  openRemoveLessonModal(lesson: Lesson): void {
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
      await this.dataManagementService.addLesson({
        title: lesson.title,
        level: this.selectedLevel,
      });
    } else if (mode === 'edit') {
      await this.dataManagementService.updateLesson(lesson);
    } else if (mode === 'delete') {
      await this.dataManagementService.deleteLesson(lesson);
    }

    this.lessonModalData$.next(undefined);
  }
}
