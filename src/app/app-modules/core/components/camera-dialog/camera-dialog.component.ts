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
  AfterViewInit,
  DoCheck,
} from '@angular/core';
import { ConfirmationService } from '../../services/confirmation.service';
import { SetLanguageComponent } from '../set-language.component';
import { HttpServiceService } from '../../services/http-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import { Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { saveAs } from 'file-saver';
import { ChartData, ChartType } from 'chart.js';
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
export class CameraDialogComponent implements OnInit, AfterViewInit, DoCheck {
  @Output() cancelEvent = new EventEmitter();

  @ViewChild('myCanvas')
  myCanvas!: { nativeElement: any };
  @ViewChild('myImg') myImg!: { nativeElement: any };
  status: any;
  public imageCode: any;
  public availablePoints: any;
  public annotate: any;
  public title: any;
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
  loaded!: boolean;
  languageComponent!: SetLanguageComponent;
  currentLanguageSet: any;
  triggerObservable: Subject<void> = new Subject<void>();
  webcamImage: WebcamImage | undefined;
  webcamInitError: WebcamInitError | undefined;
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<any> = {
    datasets: [
      {
        backgroundColor: ['red', 'green', 'blue'],
      },
    ],
  };
  constructor(
    public dialogRef: MatDialogRef<CameraDialogComponent>,
    private element: ElementRef,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
  ) {
    this.options = {
      width: 500,
      height: 390,
      video: true,
      cameraType: 'back',
    };
  }
  captureImage(webcamImage: WebcamImage): void {
    // Handle the captured image data
    this.webcamImage = webcamImage;
    this.base64 = webcamImage.imageAsDataUrl;
    this.captured = true;
  }
  handleKeyDownRecaptureImg(event: KeyboardEvent): void {
    if (event.key == 'Enter' || event.key == 'Spacebar' || event.key == ' ') {
      this.recaptureImage();
    }
  }

  recaptureImage(): void {
    // Trigger new image capture
    this.captured = false;
    this.triggerObservable.next();
  }
  captureImageButton() {
    if (this.captured) {
      this.status = 'Retry';
    } else {
      this.status = 'Capture';
    }
  }

  handleInitError(error: WebcamInitError): void {
    // Handle webcam initialization error
    this.webcamInitError = error;
  }
  ngOnInit() {
    this.loaded = false;
    this.status = 'Capture';
    if (this.availablePoints && this.availablePoints.markers)
      this.pointsToWrite = this.availablePoints.markers;
    this.fetchLanguageResponse();
  }

  Confirm() {
    this.cancelEvent.emit(null);
  }

  ngAfterViewInit() {
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
        this.confirmationService.alert(this.currentLanguageSet.maxMarkers);
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
    const containerElement = document.getElementById('container-dialog');
    if (containerElement) {
      html2canvas(containerElement).then((canvas: any) => {
        canvas.toBlob((blob: any) => {
          try {
            const graphName =
              `${this.graph.type}_${localStorage.getItem(
                'beneficiaryRegID',
              )}_${localStorage.getItem('visitID')}` || 'graphTrends';
            saveAs(blob, graphName);
          } catch (e) {
            const newWindow = window.open();
            if (newWindow) {
              newWindow.document.write(
                '<img src="' + canvas.toDataURL() + '" />',
              );
            }
          }
        });
      });
    }
  }

  // AV40085804 27/09/2021 Integrating Multilingual Functionality -----Start-----
  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
  // -----End------
}
