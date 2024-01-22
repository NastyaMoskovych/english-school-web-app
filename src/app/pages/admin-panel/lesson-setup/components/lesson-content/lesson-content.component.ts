import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { QuillEditorComponent } from 'ngx-quill';

export interface SaveContentEvent {
  contentHTML: string;
  doneCb: () => void;
}

@Component({
  selector: 'app-lesson-content',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillEditorComponent, TranslateModule],
  templateUrl: './lesson-content.component.html',
  styleUrl: './lesson-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonContentComponent {
  @Input() content: string;
  @Output() saveContentEvent = new EventEmitter<SaveContentEvent>();

  loading = signal<boolean>(false);

  onContentSave(): void {
    this.loading.set(true);
    this.saveContentEvent.emit({
      contentHTML: this.content,
      doneCb: this.stopLoading.bind(this),
    });
  }

  stopLoading(): void {
    this.loading.set(false);
  }
}
