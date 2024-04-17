import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  IframeVideoComponent,
  LoaderComponent,
  PageLayoutComponent,
} from '@app/shared/components';
import { LessonExtended } from '@firebase-api/models';
import { QuillViewHTMLComponent } from 'ngx-quill';
import { Observable, tap } from 'rxjs';
import { LessonsService } from '../../../services';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    LoaderComponent,
    IframeVideoComponent,
    QuillViewHTMLComponent,
  ],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonComponent implements OnInit {
  @Input() lessonId: string;
  @ViewChild(PageLayoutComponent) pageLayout: PageLayoutComponent;

  private lessonsService = inject(LessonsService);

  lesson$: Observable<LessonExtended>;

  ngOnInit(): void {
    this.lesson$ = this.lessonsService
      .getLessonExtended(this.lessonId)
      .pipe(tap(({ title }) => this.pageLayout.setTitle(title)));
  }
}
