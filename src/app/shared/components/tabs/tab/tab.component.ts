import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input() title: string;
  @Input() set active(value: boolean) {
    this.activeSub.next(value);
  }

  private activeSub = new BehaviorSubject<boolean>(false);
  active$ = this.activeSub.asObservable();

  get active(): boolean {
    return this.activeSub.getValue();
  }
}
