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
import { Component, OnInit, Inject, DoCheck } from '@angular/core';
import { HttpServiceService } from '../../services/http-service.service';
import { SetLanguageComponent } from '../set-language.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-previous-details',
  templateUrl: './previous-details.component.html',
  styleUrls: ['./previous-details.component.css'],
})
export class PreviousDetailsComponent implements OnInit, DoCheck {
  dataList = [];
  filteredDataList = [];
  columnList: any[] = [];
  currentLanguageSet: any;
  languageComponent!: SetLanguageComponent;

  constructor(
    public dialogRef: MatDialogRef<PreviousDetailsComponent>,
    public httpServiceService: HttpServiceService,
    @Inject(MAT_DIALOG_DATA) public input: any,
  ) {}

  ngOnInit() {
    this.fetchLanguageResponse();
    if (this.input.dataList.data instanceof Array) {
      this.dataList = this.input.dataList.data;
      this.filteredDataList = this.dataList.slice();
    }
    if (this.input.dataList.columns instanceof Array)
      this.columnList = this.input.dataList.columns;
  }

  filterPreviousData(searchTerm: any) {
    console.log('searchTerm', searchTerm);
    if (!searchTerm) this.filteredDataList = this.dataList;
    else {
      this.filteredDataList = [];
      this.dataList.forEach((item) => {
        for (const key in item) {
          const value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredDataList.push(item);
            break;
          }
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
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
