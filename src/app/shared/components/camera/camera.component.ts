import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { AuthService } from '../../services/auth';

declare var cocoSsd;
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @Output('prediction') onPrediction: EventEmitter<string> = new EventEmitter();

  predictionCtrl$: Subject<any> = new Subject();

  constructor(private auth:AuthService) {
    this.predictionCtrl$
      .pipe(throttleTime(400))
      .subscribe((x) => this.onPrediction.emit(x));
  }

  async ngOnInit() {
    if (
      navigator.mediaDevices.getUserMedia ||
      (navigator.mediaDevices as any).webkitGetUserMedia
    ) {
      // define a Promise that'll be used to load the webcam and read its frames
      const webcamPromise = navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then(
          (stream) => {
            // pass the current frame to the window.stream
            (window as any).stream = stream;
            // pass the stream to the videoRef
            this.video.nativeElement.srcObject = stream;

            return new Promise((resolve) => {
              this.video.nativeElement.onloadedmetadata = () => {
                resolve();
              };
            });
          },
          (error) => {
            console.log("Couldn't start the webcam");
            console.error(error);
          }
        );

      // define a Promise that'll be used to load the model
      const loadlModelPromise = cocoSsd.load();

      // resolve all the Promises
      Promise.all([loadlModelPromise, webcamPromise])
        .then((values) => {
          this.detectFromVideoFrame(values[0], this.video.nativeElement);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  detectFromVideoFrame = (model, video) => {
    model.detect(video).then(
      (predictions) => {
        this.predictionCtrl$.next(predictions);

        this.showDetections(predictions);

        requestAnimationFrame(() => {
          this.detectFromVideoFrame(model, video);
        });
      },
      (error) => {
        console.log("Couldn't start the webcam");
        console.error(error);
      }
    );
  };

  showDetections = (predictions) => {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = '24px helvetica';
    ctx.font = font;
    ctx.textBaseline = 'top';

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = '#2fff00';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = '#2fff00';
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      // draw top left rectangle
      ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
      // draw bottom left rectangle
      ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(prediction.class, x, y);
      ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
  };
}
