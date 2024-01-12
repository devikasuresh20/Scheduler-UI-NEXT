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
import { SchedulerService } from '../shared/services/scheduler.service';
import { SetLanguageComponent } from '../../core/components/set-language.component';
import { HttpServiceService } from '../../core/services/http-service.service';

@Component({
  selector: 'app-specialization-calander-view',
  templateUrl: './specialization-calander-view.component.html',
  styleUrls: ['./specialization-calander-view.component.css'],
})
export class SpecializationCalanderViewComponent implements OnInit, DoCheck {
  daySlots: any[] = [];
  eventWithResource: any[] = [];
  viewDate: any;
  specializationMaster: any;
  selectedSpecialization: any;
  languageComponent!: SetLanguageComponent;
  currentLanguageSet: any;

  constructor(
    private schedulerService: SchedulerService,
    public httpServiceService: HttpServiceService,
  ) {}

  ngOnInit() {
    this.initDaySlots();
    this.initEventWithResource();
    this.getSpecialisationMaster();
    this.viewDate = new Date();
    this.fetchLanguageResponse();
  }

  getSpecialisationMaster() {
    this.schedulerService.getSpecializationMaster().subscribe((res: any) => {
      if (res.statusCode == 200 && res.data) {
        this.specializationMaster = res.data;
      }
    });
  }

  getTimesheetBySpecialization() {
    const specializationDetails = {
      date: new Date(this.viewDate),
      specializationID: this.selectedSpecialization,
      userID: localStorage.getItem('tm-userID'),
      providerServiceMapID: localStorage.getItem('tm-providerServiceMapID'),
    };

    this.schedulerService
      .getTimesheetBySpecialization(specializationDetails)
      .subscribe((res: any) => {
        this.eventWithResource = res.data;
        if (this.eventWithResource.length < 8) {
          this.eventWithResource.length = 8;
        }
        this.eventWithResource.forEach((eventWithResource: any) => {
          if (
            eventWithResource.specialistAvailability &&
            eventWithResource.specialistAvailability.slots
          ) {
            eventWithResource.specialistAvailability.slots.forEach(
              (slot: any) => {
                const fromTimeArr = slot.fromTime.split(':');
                const toTimeArr = slot.toTime.split(':');
                if (fromTimeArr && fromTimeArr[0])
                  slot.index = parseInt(fromTimeArr[0]);
                if (fromTimeArr && fromTimeArr[1])
                  slot.left = parseInt(fromTimeArr[1]);
                if (fromTimeArr.length > 0 && toTimeArr.length > 0)
                  slot.width = this.calculateEventWidth(
                    fromTimeArr[0],
                    fromTimeArr[1],
                    toTimeArr[0],
                    toTimeArr[1],
                  );
              },
            );
          }
        });

        if (this.eventWithResource.length < 8) {
          this.eventWithResource.length = 8;
        }
      });
  }

  calculateEventWidth(
    fromTimeHour: any,
    fromTimeMinute: any,
    toTimeHour: any,
    toTimeMinute: any,
  ) {
    if (fromTimeHour && fromTimeMinute && toTimeHour && toTimeMinute) {
      return (toTimeHour - fromTimeHour) * 60 + (toTimeMinute - fromTimeMinute);
    }
    return 0;
  }

  initDaySlots() {
    for (let i = 0; i < 24; i++) {
      this.daySlots.push(i + ':00');
    }
  }

  initEventWithResource() {
    const temp = new Array(8);
    this.eventWithResource = temp;
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
