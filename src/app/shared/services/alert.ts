import { Injectable } from '@angular/core';
import { AudioService } from './audio';
import { SettingsService } from './settings';
import { ModalController } from '@ionic/angular';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  settings;
  alarmKey = 'alarm';
  isAlertOpen = false;
  lastAlertTime;
  constructor(
    private settingsService: SettingsService,
    private audio: AudioService,
    public modalController: ModalController
  ) {
    this.audio.preload(this.alarmKey, '/assets/alarm.mp3');
    this.settingsService.get().subscribe((x) => {
      this.settings = x;
    });
  }

  async openAlert(classTags) {
    const modal = await this.modalController.create({
      component: AlertComponent,
      componentProps: {
        classTags: classTags,
      },
    });
    await modal.present();

    return await modal.onWillDismiss();
  }

  validate(predictions, settings) {
    if (settings && predictions) {
      if (this.lastAlertTime) {
        const currentTime = new Date();
        const diff = currentTime.getTime() - this.lastAlertTime.getTime();
        const seconds = Math.floor(diff / 1000);

        settings.snooze = settings.snooze || 10;
        if (seconds < settings.snooze) return false;
      }
      for (const prediction of predictions) {
        const tags = settings.tags.split(',');
        if (tags.filter((t) => prediction.class.includes(t)).length > 0) {
          return true;
        }
      }
    }
    return false;
  }
  async onPredictions(predictions) {
    if (
      predictions &&
      predictions.length > 0 &&
      !this.isAlertOpen &&
      this.validate(predictions, this.settings)
    ) {
      const classTags = predictions.map((x) => x.class).join(',');

      if (this.settings.sound) {
        this.audio.play(this.alarmKey);
      }
      this.isAlertOpen = true;
      await this.openAlert(classTags);
      this.lastAlertTime = new Date();
      this.isAlertOpen = false;
      if (this.settings.sound) {
        this.audio.stop(this.alarmKey);
      }
    }
  }
}
