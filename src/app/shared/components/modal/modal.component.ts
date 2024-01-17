import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { fadeAnimation, transformAnimation } from '../../animations';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation, transformAnimation],
})
export class ModalComponent {
  @Input({ required: true }) title: string;
  @Input() backgroundColor = 'inherit';
  @Input() opened = false;
  @Output() closeEvent = new EventEmitter<void>();

  onClose(): void {
    this.opened = false;

    setTimeout(() => {
      this.closeEvent.emit();
    }, 300);
  }
}
