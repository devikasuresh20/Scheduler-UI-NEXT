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
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { SpecializationCalanderViewComponent } from './specialization-calander-view/specialization-calander-view.component';
import { AppointmentViewComponent } from './appointment-view/appointment-view.component';
import { MystaffComponent } from './mystaff/mystaff.component';
import { ProfileComponent } from './mystaff/profile/profile.component';
import { SmsTemplateComponent } from './sms-template/sms-template.component';
import { CreateSmsTemplateComponent } from './sms-template/create-sms-template/create-sms-template.component';
import { ViewSmsTemplateComponent } from './sms-template/view-sms-template/view-sms-template.component';
import { ChiefComplaintReportComponent } from './reports/chief-complaint-report/chief-complaint-report.component';
import { TotalConsultationReportComponent } from './reports/total-consultation-report/total-consultation-report.component';
import { ConsultationReportComponent } from './reports/consultation-report/consultation-report.component';
import { MonthlyReportComponent } from './reports/monthly-report/monthly-report.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'timesheet/:designation',
        component: TimesheetComponent,
      },
      {
        path: 'specialization/dayview',
        component: SpecializationCalanderViewComponent,
      },
      {
        path: 'appointment/view',
        component: AppointmentViewComponent,
      },
      {
        path: 'myStaff',
        component: MystaffComponent,
      },
      {
        path: 'profile/:userID',
        component: ProfileComponent,
      },
      {
        path: 'smstemplate',
        component: SmsTemplateComponent,
      },
      {
        path: 'createsmstemplate',
        component: CreateSmsTemplateComponent,
      },
      {
        path: 'viewSMSTemplate/:provider/:smsTemplateID',
        component: ViewSmsTemplateComponent,
      },
      {
        path: 'chiefComplaintReport',
        component: ChiefComplaintReportComponent,
      },
      {
        path: 'totalConsultationReport',
        component: TotalConsultationReportComponent,
      },
      {
        path: 'consultationReport',
        component: ConsultationReportComponent,
      },
      {
        path: 'monthlyReport',
        component: MonthlyReportComponent,
      },
      {
        path: 'dailyReport',
        component: DailyReportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulerRoutingModule {}
