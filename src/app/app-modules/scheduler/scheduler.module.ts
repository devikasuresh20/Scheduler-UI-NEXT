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
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { SchedulerService } from './shared/services';
import { SpecializationCalanderViewComponent } from './specialization-calander-view/specialization-calander-view.component';
import { AppointmentViewComponent } from './appointment-view/appointment-view.component';
import { MystaffComponent } from './mystaff/mystaff.component';
import { ProfileComponent } from './mystaff/profile/profile.component';
import { SmsTemplateComponent } from './sms-template/sms-template.component';
import { SmsTemplateListComponent } from './sms-template/sms-template-list/sms-template-list.component';
import { CreateSmsTemplateComponent } from './sms-template/create-sms-template/create-sms-template.component';
import { ViewSmsTemplateComponent } from './sms-template/view-sms-template/view-sms-template.component';
import { ChiefComplaintReportComponent } from './reports/chief-complaint-report/chief-complaint-report.component';
import { TotalConsultationReportComponent } from './reports/total-consultation-report/total-consultation-report.component';
import { ConsultationReportComponent } from './reports/consultation-report/consultation-report.component';
import { MonthlyReportComponent } from './reports/monthly-report/monthly-report.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../core/material.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    MatTableModule,
    MaterialModule,
    FullCalendarModule,
    NgChartsModule,
    CoreModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    TimesheetComponent,
    SpecializationCalanderViewComponent,
    AppointmentViewComponent,
    MystaffComponent,
    ProfileComponent,
    SmsTemplateComponent,
    SmsTemplateListComponent,
    CreateSmsTemplateComponent,
    ViewSmsTemplateComponent,
    ChiefComplaintReportComponent,
    TotalConsultationReportComponent,
    ConsultationReportComponent,
    MonthlyReportComponent,
    DailyReportComponent,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
