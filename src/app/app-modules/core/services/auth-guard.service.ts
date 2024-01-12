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
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from './http-service.service';
import { SetLanguageComponent } from '../components/set-language.component';

@Injectable()
export class AuthGuard {
  currentLanguageSet: any;
  languageComponent!: SetLanguageComponent;

  constructor(
    private router: Router,
    public httpServiceService: HttpServiceService,
    private route: ActivatedRoute,
  ) {
    this.fetchLanguageResponse();
  }

  // For setting language
  canActivate(route: any, state: any) {
    if (sessionStorage.getItem('tm-isAuthenticated')) {
      return true;
    } else {
      const componentName = route.component ? route.component.name : '';
      alert(this.currentLanguageSet.youAreNotAuthorised + componentName);
      this.router.navigate(['/redirin']);
      return false;
    }
  }

  // AV40085804 27/09/2021 Integrating Multilingual Functionality -----Start-----
  // ngDoCheck() {
  //   this.fetchLanguageResponse();
  // }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
  // -----End------
}
