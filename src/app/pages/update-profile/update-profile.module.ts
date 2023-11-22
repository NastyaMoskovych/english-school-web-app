import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { UpdateProfileFormComponent } from './components/update-profile-form/update-profile-form.component';
import { UpdateProfileComponent } from './update-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateProfileComponent,
  },
];

@NgModule({
  declarations: [
    UpdateProfileComponent,
    ChangePasswordFormComponent,
    UpdateProfileFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class UpdateProfileModule { }
