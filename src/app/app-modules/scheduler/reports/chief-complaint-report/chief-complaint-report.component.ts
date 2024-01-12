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
      const reports: any = [];
      const reportHeadings: any = [];
      const reportSheet: any = {};
      const wb_name = 'Chief Complaint Report';
      const criteria_worksheet: XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(criteria);
      reportHeadings.push('Criteria');
      reports.push(criteria_worksheet);
      reportSheet['Criteria'] = criteria_worksheet;
      this.chiefComplaintRawData.forEach((obj: any) => {
        obj.chiefComplaintReport.forEach((checkForNull: any) => {
          for (const key in checkForNull) {
            if (checkForNull[key] == null) {
              checkForNull[key] = '';
            }
          }
        });
      });

      for (const element of this.chiefComplaintRawData) {
        if (element.vanID) {
          const headKey = this.chiefComplaintRawData[0].chiefComplaintReport[0];
          const head = Object.keys(headKey);
          console.log('headKey', headKey);

          const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            element.chiefComplaintReport,
            { header: head },
          );
          // below code added to modify the headers

          let i = 65; // starting from 65 since it is the ASCII code of 'A'.
          let count = 0;
          console.log('head', head);
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
          // --------end--------
          const heading = element.vanName;

          reportHeadings.push(heading);
          reports.push(report_worksheet);
          reportSheet[heading] = report_worksheet;
        }
      }
      const workbook: XLSX.WorkBook = {
        Sheets: reportSheet,
        SheetNames: reportHeadings,
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
      this.confirmationService.alert(
        this.currentLanguageSet.chiefComplaintreportdownloaded,
        'success',
      );
    } else {
      this.confirmationService.alert(this.currentLanguageSet.norecordfound);
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
