import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { QuizResult } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '@shared/components';
import { getEnglishLevelPercent } from '@shared/utils';

type Action = 'CANCEL' | 'RETRY' | 'CONFIRM';

export interface CloseEvent {
  action: Action;
}

@Component({
  selector: 'app-level-check-results-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, TranslateModule],
  templateUrl: './level-check-results-modal.component.html',
  styleUrl: './level-check-results-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCheckResultsModalComponent implements OnInit {
  @Input({ required: true }) quizResult: QuizResult;
  @Output() closeEvent = new EventEmitter<CloseEvent>();
  @HostBinding('style.--progress-value-end') private progressEnd: string;

  get isFailureFlow(): boolean {
    return this.quizResult.correctAnswers < 5;
  }

  ngOnInit(): void {
    this.progressEnd = String(getEnglishLevelPercent(this.quizResult.level));
  }

  onClose(action: Action): void {
    this.closeEvent.emit({ action });
  }
}
