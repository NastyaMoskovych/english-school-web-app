import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.component').then(
        (c) => c.SignInComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.component').then(
        (c) => c.SignUpComponent,
      ),
  },
  {
    path: 'update-profile',
    loadComponent: () =>
      import('./pages/update-profile/update-profile.component').then(
        (c) => c.UpdateProfileComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin-panel',
    loadChildren: () =>
      import('./pages/admin-panel/admin-panel.routes').then(
        (c) => c.ADMIN_PANEL_ROUTES,
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./pages/about-us/about-us.component').then(
        (c) => c.AboutUsComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
