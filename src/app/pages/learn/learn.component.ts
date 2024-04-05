import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent {}
