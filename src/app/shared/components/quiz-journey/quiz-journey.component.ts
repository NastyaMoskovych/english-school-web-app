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
import { getWindowWidth } from '../../utils';

enum ITEMS_PER_PAGE {
  SMALL = 2,
  MEDIUM = 3,
  LARGE = 6,
}

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
  private currentPage = 1;
  private itemsPerPage = 6;

  loading = signal<boolean>(false);
  quizForm: FormGroup;
  sliceEnd: number;
  sliceStart: number;

  get previousDisabled(): boolean {
    return this.currentPage <= 1;
  }

  get submitShown(): boolean {
    return this.quiz.length <= this.sliceEnd;
  }

  ngOnInit(): void {
    this.initForm();
    this.initPagination();
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

  private initForm(): void {
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
  }

  private initPagination(): void {
    const windowWidth = getWindowWidth();

    if (windowWidth <= 768) {
      this.itemsPerPage = ITEMS_PER_PAGE.SMALL;
    } else if (windowWidth <= 1024) {
      this.itemsPerPage = ITEMS_PER_PAGE.MEDIUM;
    } else {
      this.itemsPerPage = ITEMS_PER_PAGE.LARGE;
    }

    this.paginate();
  }

  private paginate(): void {
    const pages = Math.ceil(this.quiz.length / this.itemsPerPage);

    if (this.currentPage > pages && pages !== 0) {
      this.currentPage = pages;
    }

    this.sliceStart = (this.currentPage - 1) * this.itemsPerPage;
    this.sliceEnd = Math.min(
      this.currentPage * this.itemsPerPage,
      this.quiz.length,
    );
  }
}
