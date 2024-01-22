import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormFieldComponent,
  IframeVideoComponent,
  ModalComponent,
} from '@shared/components';

const URL_PATTERN = '^(https?://)?(www.youtube.com|youtu.be)/.+$';

export interface SaveVideoEvent {
  videoURL: string;
  doneCb: () => void;
}

@Component({
  selector: 'app-lesson-video',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormFieldComponent,
    IframeVideoComponent,
  ],
  templateUrl: './lesson-video.component.html',
  styleUrl: './lesson-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonVideoComponent implements OnInit, OnChanges {
  @Input() videoURL: string;
  @Output() saveVideoEvent = new EventEmitter<SaveVideoEvent>();

  private formBuilder = inject(FormBuilder);

  loading = signal<boolean>(false);
  modalOpened = signal<boolean>(false);
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      videoURL: [
        this.videoURL || '',
        [Validators.required, Validators.pattern(URL_PATTERN)],
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoURL'] && this.form) {
      this.form.patchValue({ videoURL: changes['videoURL'].currentValue });
    }
  }

  toggleModal(): void {
    this.modalOpened.set(!this.modalOpened());
  }

  stopLoading(): void {
    this.modalOpened.set(false);
    this.loading.set(false);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.loading.set(true);
      this.saveVideoEvent.emit({
        videoURL: this.form.value.videoURL,
        doneCb: this.stopLoading.bind(this),
      });
    }
  }
}
