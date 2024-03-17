/*
 * AMRIT – Accessible Medical Records via Integrated Technology
 * Integrated EHR (Electronic Health Records) Solution
 *
 * Copyright (C) "Piramal Swasthya Management and Research Institute"
 *
 * This file is part of AMRIT.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from '../../services/http-service.service';
import { ConfirmationService } from '../../services';
import { SetLanguageComponent } from '../set-language.component';
import { Subject } from 'rxjs/internal/Subject';
import { ChartData, ChartType } from 'chart.js';
import html2canvas from 'html2canvas';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable } from 'rxjs';
import * as saveAs from 'file-saver';

interface Mark {
  xCord: any;
  yCord: any;
  description: any;
  point: any;
}

@Component({
  selector: 'app-camera-dialog',
  templateUrl: './camera-dialog.component.html',
  styleUrls: ['./camera-dialog.component.css'],
})
export class CameraDialogComponent implements OnInit, DoCheck {
  @Output() cancelEvent = new EventEmitter();

  @ViewChild('myCanvas')
  myCanvas!: ElementRef;
  @ViewChild('myImg')
  myImg!: ElementRef;

  status: any;
  public imageCode: any;
  public availablePoints: any;
  public annotate: any;
  public title!: string;
  public capture = false;
  public captured: any = false;
  public webcam: any;
  public graph: any;
  base64: any;
  error: any;
  options: any;
  canvas: any;
  pointsToWrite: Array<any> = [];
  markers: Mark[] = [];
  ctx!: CanvasRenderingContext2D;
  loaded = false;
  public currentLanguageSet: any;
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  public barChartType: ChartType = 'bar';
  sysImage = '';
  public barChartData: ChartData<any> = {
    datasets: [
      {
        backgroundColor: ['red', 'green', 'blue'],
      },
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<CameraDialogComponent>,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
  ) {
    this.options = {
      audio: false,
      video: true,
      width: 500,
      height: 390,
      fallbackMode: 'callback',
      fallbackSrc: 'jscam_canvas_only.swf',
      fallbackQuality: 50,
      cameraType: 'back',
    };
  }

  onSuccess(stream: any) {
    console.log('capturing video stream');
  }

  onError(err: any) {
    console.log(err);
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.loaded = false;
    this.status = this.currentLanguageSet.capture;
    if (this.availablePoints?.markers)
      this.pointsToWrite = this.availablePoints.markers;
  }

  public captureImg(webcamImage: WebcamImage): void {
    if (webcamImage) {
      this.webcamImage = webcamImage;
      this.sysImage = webcamImage?.imageAsDataUrl;
      this.captured = true;
      this.status = this.currentLanguageSet.capture;
      console.info('got webcam image', this.sysImage);
    } else {
      this.captured = false;
      this.status = this.currentLanguageSet.capture;
    }
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  Confirm() {
    this.cancelEvent.emit(null);
  }

  AfterViewInit() {
    if (this.annotate) this.loadingCanvas();

    if (!this.loaded) {
      if (this.annotate) this.loadingCanvas();
      this.loaded = true;
    }
    if (this.pointsToWrite) this.loadMarks();
  }

  loadMarks() {
    this.pointsToWrite.forEach((num) => {
      this.pointMark(num);
    });
  }

  public getSnapshot(): void {
    this.trigger.next();
    console.info('image type with base64 ', this.webcamImage);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  loadingCanvas() {
    this.canvas = this.myCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    const img = this.myImg.nativeElement;
    this.ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    this.ctx.font = 'bold 20px serif';
    this.score = 1;
  }

  handleKeyDownRecaptureImg(event: KeyboardEvent): void {
    if (
      event.key === 'Enter' ||
      event.key === 'Spacebar' ||
      event.key === ' '
    ) {
      this.recaptureImage();
    }
  }

  recaptureImage(): void {
    // Trigger new image capture
    this.captured = false;
    this.trigger.next();
  }

  handleInitError(error: WebcamInitError): void {
    // Handle webcam initialization error
    // this.webcamInitError = error;
  }

  score: any;
  pointMark(event: any) {
    if (event.xCord) event.offsetX = event.xCord;
    if (event.yCord) event.offsetY = event.yCord;
    if (this.score <= 6) {
      this.ctx.strokeRect(event.offsetX - 10, event.offsetY - 10, 20, 20);
      this.ctx.fillText(this.score, event.offsetX - 3, event.offsetY + 6);
      this.saveDescription(event);
    } else {
      setTimeout(() => {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.sixMakers,
        );
      }, 0);
    }
  }

  clearPointers() {
    this.markers.splice(0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.loadingCanvas();
  }

  saveDescription(event: any) {
    if (event.description) {
      this.markers.push({
        xCord: event.offsetX,
        yCord: event.offsetY,
        description: event.description,
        point: event.point,
      });
    } else {
      this.markers.push({
        xCord: event.offsetX,
        yCord: event.offsetY,
        description: '',
        point: this.score,
      });
    }
    this.score++;
  }

  getMarkers() {
    return {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      visitID: localStorage.getItem('visitID'),
      createdBy: localStorage.getItem('userName'),
      imageID: '',
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      markers: this.markers,
    };
  }

  downloadGraph() {
    const container = document.getElementById('container-dialog');

    if (container) {
      html2canvas(container)
        .then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              try {
                const graphName =
                  `${this.graph.type}_${localStorage.getItem(
                    'beneficiaryRegID',
                  )}_${localStorage.getItem('visitID')}` || 'graphTrends';
                saveAs(blob, graphName);
              } catch (e) {
                console.error('Error saving image:', e);

                // Perform a null check before calling window.open
                const newWindow = window.open();
                if (newWindow) {
                  newWindow.document.write(
                    '<img src="' + canvas.toDataURL() + '" />',
                  );
                } else {
                  console.error('Error opening a new window.');
                }
              }
            } else {
              console.error('Blob is null.');
            }
          });
        })
        .catch((error) => {
          console.error('Error capturing HTML element:', error);
        });
    } else {
      console.error('Element with ID "container-dialog" not found.');
    }
  }
}
