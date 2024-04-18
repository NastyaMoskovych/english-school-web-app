import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { LessonContentService, LessonsService } from '@app/services';
import { Lesson, LessonContent } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '@shared/components';
import { Observable, tap } from 'rxjs';
import { QuizTableComponent } from '../components';
import {
  LessonContentComponent,
  SaveContentEvent,
} from './components/lesson-content/lesson-content.component';
import {
  LessonImageComponent,
  UploadImageEvent,
} from './components/lesson-image/lesson-image.component';
import {
  LessonVideoComponent,
  SaveVideoEvent,
} from './components/lesson-video/lesson-video.component';

@Component({
  selector: 'app-lesson-setup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageLayoutComponent,
    LessonImageComponent,
    LessonContentComponent,
    LessonVideoComponent,
    QuizTableComponent,
  ],
  templateUrl: './lesson-setup.component.html',
  styleUrl: './lesson-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonSetupComponent implements OnInit {
  @Input() id: string;
  @ViewChild(PageLayoutComponent) pageLayout: PageLayoutComponent;

  private lesson: Lesson;
  private lessonContent: LessonContent;
  private lessonsService = inject(LessonsService);
  private lessonContentService = inject(LessonContentService);

  lessonImage: File;
  lesson$: Observable<Lesson>;
  lessonContent$: Observable<LessonContent>;

  ngOnInit(): void {
    this.lesson$ = this.lessonsService.getLessonById(this.id).pipe(
      tap((lesson) => {
        this.lesson = lesson;
        this.pageLayout.setTitle(lesson.title);
      }),
    );

    this.lessonContent$ = this.lessonContentService
      .getContentByLessonId(this.id)
      .pipe(
        tap((lessonContent) => {
          this.lessonContent = lessonContent;
        }),
      );
  }

  async onUploadImage({ imageURL, doneCb }: UploadImageEvent): Promise<void> {
    await this.lessonsService.updateLessonImage(this.lesson, imageURL);
    doneCb();
  }

  async onSaveContent({ contentHTML, doneCb }: SaveContentEvent) {
    await this.lessonContentService.updateLessonContent(this.id, {
      ...this.lessonContent,
      contentHTML,
    });
    doneCb();
  }

  async onSaveVideo({ videoURL, doneCb }: SaveVideoEvent) {
    await this.lessonContentService.updateLessonContent(this.id, {
      ...this.lessonContent,
      videoURL,
    });
    doneCb();
  }
}
