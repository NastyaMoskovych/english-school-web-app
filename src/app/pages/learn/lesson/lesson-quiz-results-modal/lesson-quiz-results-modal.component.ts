import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LevelStatusComponent, ModalComponent } from '@app/shared/components';
import { QuizResult, QuizStatuses } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';

type Action = 'CANCEL' | 'RETRY' | 'CONTINUE';

export interface CloseEvent {
  action: Action;
  quizResult: QuizResult;
}

@Component({
  selector: 'app-lesson-quiz-results-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    TranslateModule,
    LevelStatusComponent,
  ],
  templateUrl: './lesson-quiz-results-modal.component.html',
  styleUrl: './lesson-quiz-results-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonQuizResultsModalComponent {
  @Input({ required: true }) quizResult: QuizResult;
  @Output() closeEvent = new EventEmitter<CloseEvent>();

  get isFailureFlow(): boolean {
    return this.quizResult.status === QuizStatuses.INCOMPLETED;
  }

  onClose(action: Action): void {
    this.closeEvent.emit({
      action,
      quizResult: this.quizResult,
    });
  }
}
