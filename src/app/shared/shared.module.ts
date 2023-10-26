import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    PageLayoutComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    RouterModule,
    HeaderComponent,
    PageLayoutComponent,
    FooterComponent,
  ],
})
export class SharedModule { }
