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
    path: 'level-check',
    loadComponent: () =>
      import('./pages/level-check/level-check.component').then(
        (c) => c.LevelCheckComponent,
      ),
  },
  {
    path: 'learn',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/learn/learn.routes').then((c) => c.LEARN_ROUTES),
  },
  {
    path: 'admin-panel',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./pages/admin-panel/admin-panel.routes').then(
        (c) => c.ADMIN_PANEL_ROUTES,
      ),
  },
  {
    path: 'my-account',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/my-account/my-account.routes').then(
        (c) => c.MY_ACCOUNT_ROUTES,
      ),
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
