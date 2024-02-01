import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { LessonSetupComponent } from './lesson-setup/lesson-setup.component';
import { LessonsManagementComponent } from './lessons-management/lessons-management.component';
import { LevelTestSetupComponent } from './level-test-setup/level-test-setup.component';
import { UsersComponent } from './users/users.component';

export const ADMIN_PANEL_ROUTES: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
  },
  {
    path: 'lessons-management',
    component: LessonsManagementComponent,
  },
  {
    path: 'lessons-management/:id',
    component: LessonSetupComponent,
  },
  {
    path: 'level-test-setup',
    component: LevelTestSetupComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
];
