import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EXAM_REFERENCE_ID } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutComponent } from '@shared/components';
import { QuizTableComponent } from '../components';

@Component({
  selector: 'app-level-test-setup',
  standalone: true,
  imports: [PageLayoutComponent, TranslateModule, QuizTableComponent],
  templateUrl: './level-test-setup.component.html',
  styleUrl: './level-test-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelTestSetupComponent {
  referenceId = EXAM_REFERENCE_ID;
}
