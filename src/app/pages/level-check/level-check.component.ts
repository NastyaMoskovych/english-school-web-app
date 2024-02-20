import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@app/services';
import { Quiz, QuizResult } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import {
  LoaderComponent,
  PageLayoutComponent,
  QuizJourneyComponent,
  SubmitAnswersEvent,
} from '@shared/components';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  CloseEvent,
  LevelCheckResultsModalComponent,
} from './level-check-results-modal/level-check-results-modal.component';

@Component({
  selector: 'app-level-check',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageLayoutComponent,
    QuizJourneyComponent,
    LoaderComponent,
    LevelCheckResultsModalComponent,
  ],
  templateUrl: './level-check.component.html',
  styleUrl: './level-check.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCheckComponent implements OnInit {
  private quizService = inject(QuizService);
  private router = inject(Router);

  quiz$: Observable<Quiz[]>;
  quizResult$ = new BehaviorSubject<QuizResult | null>(null);

  ngOnInit(): void {
    this.getQuizForLevelCheck();
  }

  onLevelCheckSubmit({ answers, doneCb }: SubmitAnswersEvent) {
    this.quizService
      .checkUserLevel(answers)
      .pipe(
        tap((response: QuizResult) => {
          this.quizResult$.next(response);
          doneCb();
        }),
      )
      .subscribe();
  }

  onModalClose({ action }: CloseEvent): void {
    switch (action) {
      case 'RETRY': {
        this.getQuizForLevelCheck();
        break;
      }
      case 'CANCEL': {
        this.router.navigate(['/']);
        break;
      }
      case 'CONFIRM': {
        this.router.navigate(['/register']);
        break;
      }
    }

    this.quizResult$.next(null);
  }

  private getQuizForLevelCheck(): void {
    this.quiz$ = this.quizService.getQuizForLevelCheck();
  }
}
