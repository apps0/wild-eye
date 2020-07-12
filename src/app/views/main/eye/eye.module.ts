import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EyeComponent } from './eye.component';
import { SharedModule } from '../../../shared';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EyeComponent,
  },
];

@NgModule({
  declarations: [EyeComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class EyeModule {}
