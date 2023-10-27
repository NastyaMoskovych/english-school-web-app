import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    PageLayoutComponent,
    FooterComponent,
    AuthFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    HeaderComponent,
    PageLayoutComponent,
    FooterComponent,
    AuthFormComponent,
  ],
})
export class SharedModule { }
