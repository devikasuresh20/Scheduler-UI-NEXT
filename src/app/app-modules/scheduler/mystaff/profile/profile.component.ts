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
import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { SchedulerService } from '../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnChanges, DoCheck {
  specialistData: any;
  currentLanguageSet: any;
  languageComponent!: SetLanguageComponent;

  constructor(
    private schedulerService: SchedulerService,
    private activatedRoute: ActivatedRoute,
    public httpServiceService: HttpServiceService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.initializeprofile();
    this.fetchLanguageResponse();
  }

  initializeprofile() {
    const userID = this.activatedRoute.snapshot.params['userID'];
    this.getSpecialistData(userID);
  }

  ngOnChanges() {
    console.log('checkonchange');
  }
  checkOnClick() {
    console.log('checkonchangeclick');
  }
  getSpecialistData(userID: any) {
    this.schedulerService
      .getSpecialistByUserID(userID)
      .subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.specialistData = response.data;
          console.log('Specialist Data..', this.specialistData);
        }
      });
  }

  backToStaffPage() {
    this.location.back();
  }

  getChangedTab!: boolean;
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('changedtab', tabChangeEvent.index);
    if (tabChangeEvent.index == 0) this.getChangedTab = true;
    else this.getChangedTab = false;
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
