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
import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchedulerService } from '../../shared/services/scheduler.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import * as XLSX from 'xlsx';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-chief-complaint-report',
  templateUrl: './chief-complaint-report.component.html',
  styleUrls: ['./chief-complaint-report.component.css'],
})
export class ChiefComplaintReportComponent implements OnInit, DoCheck {
  chiefComplaintForm!: FormGroup;

  languageComponent!: SetLanguageComponent;
  currentLanguageSet: any;

  constructor(
    private formBuilder: FormBuilder,
    public httpServiceService: HttpServiceService,
    private schedulerService: SchedulerService,
    private confirmationService: ConfirmationService,
  ) {}

  providerServiceMapID: any;
  userID: any;
  today!: Date;
  minEndDate!: Date;
  maxDate: any;
  maxEndDate!: Date;
  chiefComplaintRawData: any[] = [];
  dateOffset: any;

  ngOnInit() {
    this.providerServiceMapID = localStorage.getItem('tm-providerServiceMapID');
    this.userID = localStorage.getItem('tm-userID');
    this.createChiefComplaintForm();
    this.today = new Date();

    this.dateOffset = 24 * 60 * 60 * 1000;
    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
    this.fetchLanguageResponse();
  }

  createChiefComplaintForm() {
    this.chiefComplaintForm = this.formBuilder.group({
      startDate: null,
      endDate: null,
    });
  }

  get startDate() {
    return this.chiefComplaintForm.controls['startDate'].value;
  }

  get endDate() {
    return this.chiefComplaintForm.controls['endDate'].value;
  }

  checkEndDate() {
    console.log('', this.startDate);

    if (this.endDate == null) {
      this.minEndDate = new Date(this.startDate);
      console.log('new Date(this.today.getDate() - 1);', new Date(this.today));
    } else {
      this.chiefComplaintForm.patchValue({
        endDate: null,
      });
      if (this.startDate != undefined && this.startDate != null)
        this.minEndDate = new Date(this.startDate);
    }
  }

  searchReport() {
    const startDate: Date = new Date(this.chiefComplaintForm.value.startDate);
    const endDate: Date = new Date(this.chiefComplaintForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log(
      'Data form value...',
      JSON.stringify(this.chiefComplaintForm.value),
    );
    const reqObjForChiefCompalintReport = {
      fromDate: new Date(
        startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000,
      ),
      toDate: new Date(
        endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000,
      ),
      providerServiceMapID: this.providerServiceMapID,
      userID: this.userID,
    };
    console.log(
      'Data form data',
      JSON.stringify(reqObjForChiefCompalintReport, null, 4),
    );

    this.schedulerService
      .getChiefComplaintReports(reqObjForChiefCompalintReport)
      .subscribe({
        next: (response: any) => {
          console.log(
            'Json data of response: ',
            JSON.stringify(response, null, 4),
          );
          if (response.statusCode == 200) {
            this.chiefComplaintRawData = response.data;
            console.log(
              'chiefComplaintRawData',
              JSON.stringify(this.chiefComplaintRawData, null, 4),
            );

            this.getResponseOfSearchThenDo();
          } else {
            this.confirmationService.alert(response.errorMessage, 'error');
          }
        },
        error: (err: any) => {
          this.confirmationService.alert(err, 'error');
        },
      });
  }

  downloadReport(downloadFlag: any) {
    if (downloadFlag === true) {
      this.searchReport();
    }
  }

  getResponseOfSearchThenDo() {
    const criteria: any = [];
    criteria.push({ Filter_Name: 'Start Date', value: this.startDate });
    criteria.push({ Filter_Name: 'End Date', value: this.endDate });
    this.exportToxlsx(criteria);
  }

  exportToxlsx(criteria: any) {
    if (this.chiefComplaintRawData.length > 0) {
      const wb_name = 'Chief_Complaint_Report';
      const blobParts: any[] = [];
      // Create Criteria worksheet
      const criteriaExcel = this.convertToExcel(criteria, 'Criteria');
      blobParts.push(criteriaExcel);
      // Process Chief Complaint Raw Data
      for (const element of this.chiefComplaintRawData) {
        if (element.vanID) {
          // Create Report worksheet
          const reportExcel = this.convertToExcel(
            element.chiefComplaintReport,
            element.vanName,
          );
          blobParts.push(reportExcel);
        }
      }
      // Combine all parts into a Blob
      const blob = new Blob(blobParts, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // Save the Blob using FileSaver
      FileSaver.saveAs(blob, `${wb_name}.xlsx`);
      this.confirmationService.alert(
        this.currentLanguageSet.chiefComplaintreportdownloaded,
        'success',
      );
    } else {
      this.confirmationService.alert(this.currentLanguageSet.norecordfound);
    }
  }
  convertToExcel(data: any[], sheetName: string): BlobPart {
    const header = Object.keys(data[0]);
    const excelContent =
      header.join('\t') +
      '\n' +
      data
        .map((row) => {
          return header
            .map((fieldName) => {
              return row[fieldName];
            })
            .join('\t');
        })
        .join('\n');
    return new Blob([excelContent], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }
  modifyHeader(headers: any, i: any) {
    let modifiedHeader: string;
    modifiedHeader = headers[i - 65]
      .toString()
      .replace(/([A-Z])/g, ' $1')
      .trim();
    modifiedHeader =
      modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.slice(1);
    return modifiedHeader.replace(/I D/g, 'ID');
  }

  //AN40085822 27/9/2021 Integrating Multilingual Functionality --Start--
  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
  //--End--
}
