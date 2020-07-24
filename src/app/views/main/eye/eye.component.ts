import { Component, OnInit, ElementRef } from '@angular/core';
declare var cocoSsd;
@Component({
  selector: 'app-eye',
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.scss'],
})
export class EyeComponent implements OnInit {
  drawerOptions: any;

  constructor(private elem: ElementRef) {
    this.drawerOptions = {
      handleHeight: 170,
      thresholdFromBottom: 200,
      thresholdFromTop: 200,
      bounceBack: true,
    };
  }

  async ngOnInit() {}
}
