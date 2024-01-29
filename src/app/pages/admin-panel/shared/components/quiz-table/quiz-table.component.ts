import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { QuizService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { Quiz } from '@shared/models';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  QuizModalComponent,
  QuizModalData,
  SubmitQuizEvent,
} from '../quiz-modal/quiz-modal.component';

@Component({
  selector: 'app-quiz-table',
  standalone: true,
  imports: [CommonModule, QuizModalComponent, TranslateModule],
  templateUrl: './quiz-table.component.html',
  styleUrl: './quiz-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizTableComponent implements OnInit {
  @Input({ required: true }) referenceId: string;

  private quizService = inject(QuizService);
  quizModalData$ = new BehaviorSubject<QuizModalData | undefined>(undefined);
  quizList$: Observable<Quiz[]>;

  ngOnInit(): void {
    this.quizList$ = this.quizService.getQuizListByReferenceId(
      this.referenceId,
    );
  }

  onAddQuiz(): void {
    this.quizModalData$.next({ mode: 'add' });
  }

  openEditQuizModal(quiz: Quiz): void {
    this.quizModalData$.next({ mode: 'edit', quiz });
  }

  openRemoveQuizModal(quiz: Quiz): void {
    this.quizModalData$.next({ mode: 'delete', quiz });
  }

  closeModal(): void {
    this.quizModalData$.next(undefined);
  }

  async onSubmitQuiz({ quiz, doneCb, mode }: SubmitQuizEvent) {
    if (mode === 'add') {
      await this.quizService.addQuiz({
        ...quiz,
        referenceId: this.referenceId,
      });
    } else if (mode === 'edit') {
      await this.quizService.editQuiz(quiz);
    } else if (mode === 'delete') {
      await this.quizService.deleteQuiz(quiz.id);
    }

    doneCb();
  }
}
