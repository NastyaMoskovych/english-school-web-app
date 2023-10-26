import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us.component';

const routes: Routes = [
  {
    component: AboutUsComponent,
    path: '',
  },
];

@NgModule({
  declarations: [
    AboutUsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class AboutUsModule { }
