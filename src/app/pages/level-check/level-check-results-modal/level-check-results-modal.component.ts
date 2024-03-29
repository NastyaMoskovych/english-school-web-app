import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IUser } from '@app/shared/models';
import { MINIMUM_CORRECT_ANSWERS, QuizResult } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import { LevelStatusComponent, ModalComponent } from '@shared/components';
import { FirstNamePipe } from '@shared/pipes';

type Action = 'CANCEL' | 'RETRY' | 'CONFIRM';

export interface CloseEvent {
  action: Action;
  user: IUser | null;
}

@Component({
  selector: 'app-level-check-results-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    TranslateModule,
    FirstNamePipe,
    LevelStatusComponent,
  ],
  templateUrl: './level-check-results-modal.component.html',
  styleUrl: './level-check-results-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCheckResultsModalComponent {
  @Input({ required: true }) quizResult: QuizResult;
  @Input() user: IUser | null;
  @Output() closeEvent = new EventEmitter<CloseEvent>();

  get isFailureFlow(): boolean {
    return this.quizResult.correctAnswers < MINIMUM_CORRECT_ANSWERS;
  }

  onClose(action: Action): void {
    this.closeEvent.emit({ action, user: this.user });
  }
}
