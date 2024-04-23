import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, QuizService } from '@app/services';
import { IUser } from '@app/shared/models';
import { EXAM_REFERENCE_ID, Quiz, QuizResult } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import {
  LoaderComponent,
  PageLayoutComponent,
  QuizJourneyComponent,
  SubmitAnswersEvent,
} from '@shared/components';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';
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
  user$ = inject(AuthService).user$;

  ngOnInit(): void {
    this.getQuizForLevelCheck();
  }

  onLevelCheckSubmit({ answers, doneCb }: SubmitAnswersEvent) {
    const { uid } = this.user$.value || {};

    this.quizService
      .checkUserLevel({ answers, uid })
      .pipe(
        tap((response: QuizResult) => this.quizResult$.next(response)),
        finalize(() => doneCb()),
      )
      .subscribe();
  }

  onModalClose({ action, user, quizResult }: CloseEvent): void {
    switch (action) {
      case 'RETRY': {
        this.getQuizForLevelCheck();
        break;
      }
      case 'CANCEL': {
        this.router.navigate([this.getCancelRedirectUrl(user)]);
        break;
      }
      case 'CONFIRM': {
        this.router.navigate([this.getConfirmRedirectUrl(user)], {
          queryParams: { sessionId: quizResult.sessionId },
        });
        break;
      }
    }

    this.quizResult$.next(null);
  }

  private getQuizForLevelCheck(): void {
    this.quiz$ = this.quizService.getQuizByReferenceId(EXAM_REFERENCE_ID);
  }

  private getConfirmRedirectUrl(user: IUser | null): string {
    if (user?.uid) {
      return '/my-account';
    }

    return '/signup';
  }

  private getCancelRedirectUrl(user: IUser | null): string {
    if (user?.uid) {
      return '/my-account';
    }

    return '/';
  }
}
