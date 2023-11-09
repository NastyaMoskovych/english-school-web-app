import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { AuthErrorPipe } from './pipes/auth-error.pipe';
import { FirstNamePipe } from './pipes/first-name.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    PageLayoutComponent,
    FooterComponent,
    AuthFormComponent,
    FirstNamePipe,
    AuthErrorPipe,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    HeaderComponent,
    PageLayoutComponent,
    FooterComponent,
    AuthFormComponent,
    FirstNamePipe,
    AuthErrorPipe,
    NotificationComponent,
  ],
})
export class SharedModule { }
