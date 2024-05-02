import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IframeVideoComponent,
  LoaderComponent,
  PageLayoutComponent,
  QuizJourneyComponent,
  SubmitAnswersEvent,
  TabComponent,
  TabsComponent,
} from '@app/shared/components';
import { LessonExtended, Quiz, QuizResult } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import { QuillViewHTMLComponent } from 'ngx-quill';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';
import { AuthService, LessonsService, QuizService } from '../../../services';
import {
  CloseEvent,
  LessonQuizResultsModalComponent,
} from './lesson-quiz-results-modal/lesson-quiz-results-modal.component';

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
    LessonQuizResultsModalComponent,
  ],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonComponent implements OnInit {
  @Input() lessonId: string;
  @ViewChild(PageLayoutComponent) pageLayout: PageLayoutComponent;

  private authService = inject(AuthService);
  private lessonsService = inject(LessonsService);
  private quizService = inject(QuizService);
  private router = inject(Router);

  lesson$: Observable<LessonExtended>;
  quiz$: Observable<Quiz[]>;
  quizResult$ = new BehaviorSubject<QuizResult | null>(null);

  ngOnInit(): void {
    this.lesson$ = this.lessonsService
      .getLessonExtended(this.lessonId)
      .pipe(tap(({ title }) => this.pageLayout.setTitle(title)));

    this.getQuizForLesson();
  }

  onQuizSubmit({ answers, doneCb }: SubmitAnswersEvent) {
    this.quizService
      .submitQuizForLesson(this.lessonId, {
        answers,
        uid: this.authService.currentUserUID,
      })
      .pipe(
        tap((response: QuizResult) => this.quizResult$.next(response)),
        finalize(() => doneCb()),
      )
      .subscribe();
  }

  onModalClose({ action }: CloseEvent): void {
    switch (action) {
      case 'RETRY': {
        this.getQuizForLesson();
        break;
      }
      case 'CONTINUE': {
        this.router.navigate(['/learn']);
        break;
      }
    }

    this.quizResult$.next(null);
  }

  private getQuizForLesson(): void {
    this.quiz$ = this.quizService.getQuizByReferenceId(this.lessonId);
  }
}
