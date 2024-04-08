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
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { HttpServiceService } from './services/http-service.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ConfirmationService } from './services/confirmation.service';
import { CommonDialogComponent } from './components/common-dialog/common-dialog.component';
import { SpinnerService } from './services/spinner.service';
import { AuthGuard } from './services/auth-guard.service';
import { SetLanguageComponent } from './components/set-language.component';
import { BeneficiaryDetailsService } from './services/beneficiary-details.service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { CameraService } from './services/camera.service';
import { CameraDialogComponent } from './components/camera-dialog/camera-dialog.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ShowCommitAndVersionDetailsComponent } from './components/show-commit-and-version-details/show-commit-and-version-details.component';
import { PreviousDetailsComponent } from './components/previous-details/previous-details.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TextareaDialogComponent } from './components/textarea-dialog/textarea-dialog.component';
import { NullDefaultValueDirective } from './directives/null-default-value.directive';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from './material.module';
import { WebcamModule } from 'ngx-webcam';
import { NgChartsModule } from 'ng2-charts';
import { MyMobileNumberDirective } from './directives/MobileNumber/myMobileNumber.directive';
import { DisableFormControlDirective } from './directives/disableFormControl.directive';
import { myEmailDirective } from './directives/email/myEmail.directive';
import { myNameDirective } from './directives/name/myName.directive';
import { NumberValidatorDirective } from './directives/numberValidator.directive';
import { myPasswordDirective } from './directives/password/myPassword.directive';
import { StringValidatorDirective } from './directives/stringValidator.directive';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

const lang = 'en-US';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    WebcamModule,
    NgChartsModule,
    NgxMatTimepickerModule.setLocale(lang),
  ],
  declarations: [
    CommonDialogComponent,
    CameraDialogComponent,
    TextareaDialogComponent,
    SpinnerComponent,
    AppFooterComponent,
    SetLanguageComponent,
    AppHeaderComponent,
    PreviousDetailsComponent,
    ShowCommitAndVersionDetailsComponent,
    myEmailDirective,
    MyMobileNumberDirective,
    myNameDirective,
    myPasswordDirective,
    DisableFormControlDirective,
    NullDefaultValueDirective,
    NumberValidatorDirective,
    StringValidatorDirective,
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SetLanguageComponent,
    CommonDialogComponent,
    CameraDialogComponent,
    TextareaDialogComponent,
    SpinnerComponent,
    AppFooterComponent,
    AppHeaderComponent,
    PreviousDetailsComponent,
    ShowCommitAndVersionDetailsComponent,
    myEmailDirective,
    MyMobileNumberDirective,
    myNameDirective,
    myPasswordDirective,
    DisableFormControlDirective,
    NullDefaultValueDirective,
    NumberValidatorDirective,
    StringValidatorDirective,
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: LOCALE_ID, useValue: lang },

        ConfirmationService,
        CameraService,
        BeneficiaryDetailsService,
        HttpInterceptorService,
        HttpServiceService,
        AuthGuard,
        AuthService,
        SpinnerService,
        CanDeactivateGuardService,
        GlobalErrorHandler,
      ],
    };
  }
}
