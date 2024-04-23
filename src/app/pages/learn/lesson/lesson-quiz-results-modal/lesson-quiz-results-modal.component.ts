import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ModalComponent } from '@app/shared/components';
import { LessonQuizResult, QuizStatuses } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';

type Action = 'CANCEL' | 'RETRY' | 'CONTINUE';

export interface CloseEvent {
  action: Action;
  quizResult: LessonQuizResult;
}

@Component({
  selector: 'app-lesson-quiz-results-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, TranslateModule],
  templateUrl: './lesson-quiz-results-modal.component.html',
  styleUrl: './lesson-quiz-results-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonQuizResultsModalComponent {
  @Input({ required: true }) quizResult: LessonQuizResult;
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
