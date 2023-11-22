import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';

import { AuthErrorPipe } from './pipes/auth-error.pipe';
import { FirstNamePipe } from './pipes/first-name.pipe';
import { PhotoUrlPipe } from './pipes/photo-url.pipe';

const components = [
  HeaderComponent,
  PageLayoutComponent,
  FooterComponent,
  AuthFormComponent,
  NotificationComponent,
  FormFieldComponent,
  LanguageSelectorComponent,
];

const pipes = [
  FirstNamePipe,
  AuthErrorPipe,
  PhotoUrlPipe,
];

@NgModule({
  declarations: [
    ...components,
    ...pipes,
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
    ...components,
    ...pipes,
  ],
})
export class SharedModule { }
