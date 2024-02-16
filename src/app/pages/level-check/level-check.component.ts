import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { QuizService } from '@app/services';
import { UserAnswer } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import {
  LoaderComponent,
  PageLayoutComponent,
  QuizJourneyComponent,
} from '@shared/components';

@Component({
  selector: 'app-level-check',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageLayoutComponent,
    QuizJourneyComponent,
    LoaderComponent,
  ],
  templateUrl: './level-check.component.html',
  styleUrl: './level-check.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCheckComponent {
  private quizService = inject(QuizService);

  quiz$ = this.quizService.getQuizForLevelCheck();

  onLevelCheckSubmit(payload: UserAnswer[]) {
    this.quizService.checkUserLevel(payload).subscribe();
  }
}
