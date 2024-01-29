import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldComponent, ModalComponent } from '@shared/components';
import { Lesson } from '@shared/models';

export interface LessonModalData {
  mode: 'add' | 'edit' | 'delete';
  lesson?: Lesson;
}

@Component({
  selector: 'app-lesson-modal',
  standalone: true,
  imports: [
    ModalComponent,
    TranslateModule,
    FormFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './lesson-modal.component.html',
  styleUrl: './lesson-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonModalComponent implements OnInit {
  @Input() data: LessonModalData;
  @Input() opened = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<LessonModalData>();

  private formBuilder = inject(FormBuilder);

  form: FormGroup;
  loading = false;

  get modalTitleKey(): string {
    return `adminPanel.lessonsManagement.lessonModal.title.${this.data.mode}`;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [
        this.data.lesson?.title || '',
        [Validators.required, Validators.minLength(4)],
      ],
    });
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.loading = true;
      this.submitEvent.emit({
        mode: this.data.mode,
        lesson: {
          ...this.data.lesson,
          ...this.form.value,
        },
      });
    }
  }
}
