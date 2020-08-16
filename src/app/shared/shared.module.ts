import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CameraComponent } from './components/camera/camera.component';
import { AlertComponent } from './components/alert/alert.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CameraComponent, AlertComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [CommonModule, IonicModule, CameraComponent, AlertComponent],
})
export class SharedModule {}
