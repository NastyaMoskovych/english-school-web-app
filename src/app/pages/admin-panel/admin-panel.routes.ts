import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { DataManagementComponent } from './data-management/data-management.component';
import { UsersComponent } from './users/users.component';

export const ADMIN_PANEL_ROUTES: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
  },
  {
    path: 'data-management',
    component: DataManagementComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
];
