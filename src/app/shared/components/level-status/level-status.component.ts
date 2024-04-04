import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { EnglishLevel } from '@firebase-api/models';
import { getEnglishLevelPercent } from '../../utils';

@Component({
  selector: 'app-level-status',
  standalone: true,
  imports: [],
  templateUrl: './level-status.component.html',
  styleUrl: './level-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelStatusComponent implements OnInit {
  @Input({ required: true }) level: EnglishLevel;
  @HostBinding('style.--progress-value-end') private progressEnd: string;

  ngOnInit(): void {
    this.progressEnd = String(getEnglishLevelPercent(this.level));
  }
}
