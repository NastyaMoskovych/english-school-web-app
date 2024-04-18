import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  IframeVideoComponent,
  LoaderComponent,
  PageLayoutComponent,
  QuizJourneyComponent,
  TabComponent,
  TabsComponent,
} from '@app/shared/components';
import { LessonExtended, Quiz } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import { QuillViewHTMLComponent } from 'ngx-quill';
import { Observable, tap } from 'rxjs';
import { LessonsService, QuizService } from '../../../services';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageLayoutComponent,
    LoaderComponent,
    IframeVideoComponent,
    QuillViewHTMLComponent,
    TabComponent,
    TabsComponent,
    QuizJourneyComponent,
  ],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonComponent implements OnInit {
  @Input() lessonId: string;
  @ViewChild(PageLayoutComponent) pageLayout: PageLayoutComponent;

  private lessonsService = inject(LessonsService);
  private quizService = inject(QuizService);

  lesson$: Observable<LessonExtended>;
  quiz$: Observable<Quiz[]>;

  ngOnInit(): void {
    this.lesson$ = this.lessonsService
      .getLessonExtended(this.lessonId)
      .pipe(tap(({ title }) => this.pageLayout.setTitle(title)));

    this.quiz$ = this.quizService.getQuizByReferenceId(this.lessonId);
  }
}
