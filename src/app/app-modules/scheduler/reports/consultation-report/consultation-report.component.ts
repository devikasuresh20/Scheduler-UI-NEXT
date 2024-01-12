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

import { SchedulerService } from '../../shared/services/scheduler.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import * as XLSX from 'xlsx';
import { SetLanguageComponent } from '../../../core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-consultation-report',
  templateUrl: './consultation-report.component.html',
  styleUrls: ['./consultation-report.component.css'],
})
export class ConsultationReportComponent implements OnInit, DoCheck {
  consultationForm!: FormGroup;

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
  maxEndDate!: Date;
  consultationReportList = [];

  ngOnInit() {
    this.providerServiceMapID = localStorage.getItem('tm-providerServiceMapID');
    this.userID = localStorage.getItem('tm-userID');
    this.fetchLanguageResponse();
    this.createConsultationForm();
    /* Set Max date*/
    this.maxEndDate = new Date();
    this.today = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
  }
  createConsultationForm() {
    this.consultationForm = this.formBuilder.group({
      fromDate: null,
      toDate: null,
    });
  }
  get fromDate() {
    return this.consultationForm.controls['fromDate'].value;
  }

  get toDate() {
    return this.consultationForm.controls['toDate'].value;
  }

  checkEndDate() {
    if (this.toDate == null) {
      this.minEndDate = new Date(this.fromDate);
    } else {
      this.consultationForm.patchValue({
        toDate: null,
      });
      if (this.fromDate != undefined && this.fromDate != null)
        this.minEndDate = new Date(this.fromDate);
    }
  }
  downloadReport(downloadFlag: boolean) {
    if (downloadFlag) {
      this.setDate();
    }
  }

  setDate() {
    const fromDate: Date = new Date(this.consultationForm.value.fromDate);
    const toDate: Date = new Date(this.consultationForm.value.toDate);

    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);

    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    toDate.setMilliseconds(0);
    this.searchReport(fromDate, toDate);
  }

  searchReport(fromDate: any, toDate: any) {
    const reqObjForConsultantReport = {
      fromDate: new Date(
        fromDate.valueOf() - 1 * fromDate.getTimezoneOffset() * 60 * 1000,
      ),
      toDate: new Date(
        toDate.valueOf() - 1 * toDate.getTimezoneOffset() * 60 * 1000,
      ),
      providerServiceMapID: this.providerServiceMapID,
      userID: this.userID,
    };
    this.schedulerService
      .getConsultantReport(reqObjForConsultantReport)
      .subscribe({
        next: (response: any) => {
          console.log(
            'Json data of response: ',
            JSON.stringify(response, null, 4),
          );
          if (response.statusCode == 200) {
            this.consultationReportList = response.data;
            this.createSearchCriteria();
          } else {
            this.confirmationService.alert(response.errorMessage, 'error');
          }
        },
        error: (err: any) => {
          this.confirmationService.alert(err, 'error');
        },
      });
  }

  createSearchCriteria() {
    const criteria: any = [];
    criteria.push({ Filter_Name: 'From date', value: this.fromDate });
    criteria.push({ Filter_Name: 'To date', value: this.toDate });
    this.exportToxlsx(criteria);
  }

  exportToxlsx(criteria: any) {
    if (this.consultationReportList.length > 0) {
      const array = this.checkDataForNull();
      if (array.length != 0) {
        const head = Object.keys(array[0]);
        const wb_name = 'Consultation Report';
        const criteria_worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(criteria);
        const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.consultationReportList,
          { header: head },
        );

        const data = this.assignDataToColumns(head, report_worksheet);
        this.createWorkBook(data, wb_name, criteria_worksheet);
      }
      this.confirmationService.alert(
        this.currentLanguageSet.consultationReportdownloaded,
        'success',
      );
    } else {
      this.confirmationService.alert(this.currentLanguageSet.norecordfound);
    }
  }

  checkDataForNull() {
    const array = this.consultationReportList.filter(function (obj: any) {
      for (const key in obj) {
        if (obj[key] === null) {
          obj[key] = '';
        }
      }
      return obj;
    });
    return array;
  }

  assignDataToColumns(head: any, report_worksheet: any) {
    let i = 65; // starting from 65 since it is the ASCII code of 'A'.
    let count = 0;
    while (i < head.length + 65) {
      let j;
      if (count > 0) {
        j = i - 26 * count;
      } else {
        j = i;
      }
      const cellPosition = String.fromCharCode(j);
      let finalCellName: any;
      if (count == 0) {
        finalCellName = cellPosition + '1';
        console.log(finalCellName);
      } else {
        const newcellPosition = String.fromCharCode(64 + count);
        finalCellName = newcellPosition + cellPosition + '1';
        console.log(finalCellName);
      }
      const newName = this.modifyHeader(head, i);
      delete report_worksheet[finalCellName].w;
      report_worksheet[finalCellName].v = newName;
      i++;
      if (i == 91 + count * 26) {
        count++;
      }
    }
    return report_worksheet;
  }

  createWorkBook(data: any, wb_name: any, criteria_worksheet: any) {
    const workbook: XLSX.WorkBook = {
      Sheets: { Report: data, Criteria: criteria_worksheet },
      SheetNames: ['Criteria', 'Report'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    if ((navigator as any).msSaveBlob) {
      (navigator as any).msSaveBlob(blob, wb_name);
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('visibility', 'hidden');
      link.download = wb_name.replace(/ /g, '_') + '.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
