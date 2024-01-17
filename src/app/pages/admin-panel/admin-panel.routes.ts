import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { LessonsManagementComponent } from './lessons-management/lessons-management.component';
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
    path: 'users',
    component: UsersComponent,
  },
];
