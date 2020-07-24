import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DrawerComponent } from './components/drawer/drawer.component';
import { CameraComponent } from './components/camera/camera.component';
@NgModule({
  declarations: [DrawerComponent, CameraComponent],
  imports: [CommonModule, IonicModule],
  exports: [CommonModule, IonicModule, DrawerComponent, CameraComponent],
})
export class SharedModule {}
