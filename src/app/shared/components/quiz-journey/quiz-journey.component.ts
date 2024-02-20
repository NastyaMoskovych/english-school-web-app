import { SlicePipe } from '@angular/common';
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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Quiz, UserAnswer } from '@firebase-api/models';
import { TranslateModule } from '@ngx-translate/core';
import { AnswerFormatPipe } from '../../pipes';

const ITEMS_PER_PAGE = 6;

export interface SubmitAnswersEvent {
  answers: UserAnswer[];
  doneCb: () => void;
}

@Component({
  selector: 'app-quiz-journey',
  standalone: true,
  imports: [SlicePipe, AnswerFormatPipe, ReactiveFormsModule, TranslateModule],
  templateUrl: './quiz-journey.component.html',
  styleUrl: './quiz-journey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizJourneyComponent implements OnInit {
  @Input({ required: true }) quiz: Quiz[];
  @Output() submitEvent = new EventEmitter<SubmitAnswersEvent>();

  private formBuilder = inject(FormBuilder);

  quizForm: FormGroup;
  loading = signal<boolean>(false);
  sliceStart = 0;
  sliceEnd = ITEMS_PER_PAGE + 1;
  currentPage = 1;

  get previousDisabled(): boolean {
    return this.currentPage <= 1;
  }

  get submitShown(): boolean {
    return this.quiz.length <= this.sliceEnd;
  }

  ngOnInit(): void {
    this.quizForm = this.formBuilder.group({
      answers: this.formBuilder.array(
        this.quiz.map(({ id }) =>
          this.formBuilder.group({
            id,
            answer: '',
          }),
        ),
      ),
    });

    this.paginate();
  }

  onPreviousPage(): void {
    this.currentPage--;
    this.paginate();
  }

  onNextPage(): void {
    this.currentPage++;
    this.paginate();
  }

  onQuizSubmit(): void {
    this.loading.set(true);

    this.submitEvent.emit({
      answers: this.quizForm.value.answers,
      doneCb: () => {
        this.loading.set(false);
      },
    });
  }

  private paginate(): void {
    const pages = Math.ceil(this.quiz.length / ITEMS_PER_PAGE);

    if (this.currentPage > pages && pages !== 0) {
      this.currentPage = pages;
    }

    this.sliceStart = (this.currentPage - 1) * ITEMS_PER_PAGE + 1 - 1;
    this.sliceEnd = Math.min(
      this.currentPage * ITEMS_PER_PAGE,
      this.quiz.length,
    );
  }
}
