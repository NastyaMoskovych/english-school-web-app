import { Routes } from '@angular/router';
import { MyAccountComponent } from './my-account.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

export const MY_ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: MyAccountComponent,
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent,
  },
];
