import { Component, OnInit, ElementRef } from '@angular/core';
declare var cocoSsd;
@Component({
  selector: 'app-eye',
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.scss'],
})
export class EyeComponent implements OnInit {
  video: HTMLVideoElement;

  constructor(private elem: ElementRef) {}

  async ngOnInit() {
    await this.webcamInit();
    this.predictWithCocoModel();
  }

  async webcamInit() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: 'user' },
    });

    this.video = this.video = <HTMLVideoElement>(
      this.elem.nativeElement.querySelector('#myVideo')
    );
    this.video.srcObject = stream;
    this.video.onloadedmetadata = () => {
      this.video.play();
    };
  }

  public async predictWithCocoModel() {
    const model = await cocoSsd.load('lite_mobilenet_v2');
    this.detectFrame(this.video, model);
  }

  detectFrame = (video, model) => {
    model.detect(video).then((predictions) => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };

  renderPredictions = (predictions) => {
    // console.log(predictions);
    const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');

    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 480;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Fonts
    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.drawImage(this.video, 0, 0, 600, 480);

    predictions.forEach((prediction) => {
      // Bounding boxes's coordinates and sizes
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Bounding box style
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      // Draw the bounding
      ctx.strokeRect(x, y, width, height);

      // Label background
      ctx.fillStyle = '#00FFFF';
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach((prediction) => {
      // Write prediction class names
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      ctx.fillStyle = '#000000';
      ctx.fillText(prediction.class, x, y);
    });
  };
}
