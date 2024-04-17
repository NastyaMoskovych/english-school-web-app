import { Routes } from '@angular/router';
import { LearnComponent } from './learn.component';
import { LessonComponent } from './lesson/lesson.component';

export const LEARN_ROUTES: Routes = [
  {
    path: '',
    component: LearnComponent,
  },
  {
    path: ':lessonId',
    component: LessonComponent,
  },
];
