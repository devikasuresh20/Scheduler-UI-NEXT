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
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { SchedulerService } from '../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SetLanguageComponent } from '../../../core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
@Component({
  selector: 'app-view-sms-template',
  templateUrl: './view-sms-template.component.html',
  styleUrls: ['./view-sms-template.component.css'],
})
export class ViewSmsTemplateComponent implements OnInit, DoCheck {
  languageComponent!: SetLanguageComponent;
  currentLanguageSet: any;

  constructor(
    private schedulerService: SchedulerService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {}
  fullSMSTemplate: any;
  ngOnInit() {
    this.getFullSMSTemplate();
  }

  getFullSMSTemplate() {
    const reqObj = {
      providerServiceMapID: this.activatedRoute.snapshot.params['provider'],
      smsTemplateID: this.activatedRoute.snapshot.params['smsTemplateID'],
    };
    this.schedulerService.getFullSMSTemplate(reqObj).subscribe({
      next: (res: any) => {
        console.log('res', res);
        if (res && res.statusCode == 200) {
          this.fullSMSTemplate = res.data;
        } else {
          this.confirmationService.alert(res.errorMessage, 'error');
          this.location.back();
        }
      },
      error: (err: any) => {
        this.confirmationService.alert(err, 'error');
        this.location.back();
      },
    });
  }

  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
}
