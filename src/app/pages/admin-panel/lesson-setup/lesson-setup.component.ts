import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '@shared/components';
import { Lesson, LessonContent } from '@shared/models';
import { Observable, tap } from 'rxjs';
import { LessonContentService } from '../../../services/lesson-content.service';
import { LessonsService } from '../../../services/lessons.service';
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
  ],
  templateUrl: './lesson-setup.component.html',
  styleUrl: './lesson-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonSetupComponent implements OnInit {
  @Input() id: string;
  @ViewChild(PageLayoutComponent) pageLayout: PageLayoutComponent;

  private lessonContent: LessonContent;
  private lessonsService = inject(LessonsService);
  private lessonContentService = inject(LessonContentService);

  lessonImage: File;
  lesson$: Observable<Lesson>;
  lessonContent$: Observable<LessonContent>;

  ngOnInit(): void {
    this.lesson$ = this.lessonsService.getLessonById(this.id).pipe(
      tap((lesson) => {
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
    await this.lessonContentService.updateContentImage(
      this.id,
      imageURL,
      this.lessonContent,
    );
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