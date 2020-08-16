import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  AlertComponent,
  AlertService,
  SettingsService,
  AudioService,
} from 'src/app/shared';
declare var cocoSsd;
@Component({
  selector: 'app-eye',
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.scss'],
})
export class EyeComponent implements OnInit {
  constructor(private alertService: AlertService) {}

  async ngOnInit() {}

  async onPrediction(predictions) {
    console.count('predictions');
    this.alertService.onPredictions(predictions);
  }
}
