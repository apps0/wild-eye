import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'eye',
        loadChildren: () => import('./eye/eye.module').then((m) => m.EyeModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: '',
        redirectTo: 'settings',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [IonicModule, RouterModule.forChild(routes), SharedModule],
})
export class MainModule {}
