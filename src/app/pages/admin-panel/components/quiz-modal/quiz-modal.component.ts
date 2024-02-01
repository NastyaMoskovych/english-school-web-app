import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DropdownComponent,
  DropdownOption,
  FormFieldComponent,
  ModalComponent,
} from '@shared/components';
import { ENGLISH_LEVELS_OPTIONS } from '@shared/constants';
import { Quiz } from '@shared/models';
import { Observable, debounceTime, map, startWith } from 'rxjs';

const MAX_ANSWERS = 8;

export interface QuizModalData {
  mode: 'add' | 'edit' | 'delete';
  quiz?: Quiz;
  level?: string;
}

export interface SubmitQuizEvent extends QuizModalData {
  quiz: Quiz;
  doneCb: () => void;
}

interface AnswerItem {
  answer: string;
}

@Component({
  selector: 'app-quiz-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormFieldComponent,
    ModalComponent,
    DropdownComponent,
  ],
  templateUrl: './quiz-modal.component.html',
  styleUrl: './quiz-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizModalComponent implements OnInit {
  @Input() data: QuizModalData;
  @Input({ required: true }) opened: boolean;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitQuizEvent = new EventEmitter<SubmitQuizEvent>();

  private formBuilder = inject(FormBuilder);

  isJsonView = false;
  answersOptions$: Observable<DropdownOption[]>;
  levelsOptions = ENGLISH_LEVELS_OPTIONS;
  form: FormGroup;
  loading = signal<boolean>(false);
  maxAnswersCount = MAX_ANSWERS;
  selectedAnswer: DropdownOption | null;

  get selectedLevel(): DropdownOption | null {
    const { level } = this.form.value;

    if (!level) {
      return null;
    }

    return {
      label: level,
      value: level,
    };
  }

  get modalTitleKey(): string {
    return `adminPanel.lessonsManagement.quizModal.title.${this.data.mode}`;
  }

  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  get correctAnswer(): FormControl {
    return this.form.get('correctAnswer') as FormControl;
  }

  get isDeleteMode(): boolean {
    return this.data.mode === 'delete';
  }

  ngOnInit(): void {
    const { quiz, level } = this.data;

    this.form = this.formBuilder.group({
      question: [
        quiz?.question || '',
        [Validators.required, Validators.minLength(4)],
      ],
      level: [quiz?.level || level || '', [Validators.required]],
      answers: this.formBuilder.array([]),
      correctAnswer: [quiz?.correctAnswer || '', Validators.required],
    });

    if (quiz) {
      const { correctAnswer } = quiz;
      quiz.answers.forEach((answer: string) =>
        this.answers.push(this.addAnswerField(answer)),
      );

      this.selectedAnswer = {
        value: correctAnswer,
        label: correctAnswer,
      };
    }

    this.answersOptions$ = this.answers.valueChanges.pipe(
      startWith(this.answers.value),
      debounceTime(300),
      map((answers: AnswerItem[]) =>
        answers
          .filter(({ answer }: AnswerItem) => answer)
          .map(({ answer: value }: AnswerItem) => ({ value, label: value })),
      ),
    );
  }

  onAddAnswer(): void {
    this.answers.push(this.addAnswerField());
  }

  onRemoveAnswer(idx: number): void {
    this.answers.removeAt(idx);
    const { answers, correctAnswer } = this.form.value;

    if (correctAnswer) {
      const selectedAnswer = answers.find(
        ({ answer }: AnswerItem) => answer === correctAnswer,
      );

      if (!selectedAnswer) {
        this.correctAnswer.setValue('');
        this.selectedAnswer = null;
      }
    }
  }

  onAnswerSelect(option: DropdownOption): void {
    this.selectedAnswer = option;
  }

  onModelChange(value: string): void {
    try {
      const parsedValue = JSON.parse(value);
      this.form.patchValue(parsedValue);

      if (parsedValue.correctAnswer) {
        this.selectedAnswer = {
          label: parsedValue.correctAnswer,
          value: parsedValue.correctAnswer,
        };
      }

      if (parsedValue.answers.length) {
        this.answers.clear();
        parsedValue.answers.forEach(({ answer }: AnswerItem) =>
          this.answers.push(this.addAnswerField(answer)),
        );
      }
    } catch (e) {
      console.warn(e);
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const event = {
        mode: this.data.mode,
        quiz: {
          ...this.data.quiz,
          ...this.form.value,
          answers: this.answers.value.map(({ answer }: AnswerItem) => answer),
        },
        doneCb: () => {
          this.loading.set(false);
          this.closeEvent.emit();
        },
      };

      this.loading.set(true);
      this.submitQuizEvent.emit(event);
    }
  }

  private addAnswerField(value = ''): FormGroup {
    return this.formBuilder.group({
      answer: [value, [Validators.required]],
    });
  }
}
