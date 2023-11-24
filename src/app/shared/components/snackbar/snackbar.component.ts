import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { tap } from 'rxjs/operators';
import {
  ISnackbarPayload,
  SnackbarService,
} from '../../../services/snackbar.service';
import { lightSpeedAnimation } from '../../animations';
import { NotificationComponent } from '../notification/notification.component';

const AUTOCLOSE_TIMEOUT = 5000;

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [lightSpeedAnimation],
})
export class SnackbarComponent {
  private snackbarService = inject(SnackbarService);
  private timeout: NodeJS.Timeout;

  shown = signal(false);
  message$ = this.snackbarService.message$.pipe(
    tap((data) => {
      this.shown.set(!!data);
      this.autoClose(data);
    }),
  );

  onClose(): void {
    this.shown.set(false);
    setTimeout(() => this.snackbarService.hide(), 500);
  }

  private autoClose(message: ISnackbarPayload | null): void {
    if (message) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.onClose(), AUTOCLOSE_TIMEOUT);
    }
  }
}
