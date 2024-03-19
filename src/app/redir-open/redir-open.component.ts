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
import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { SpinnerService } from '../app-modules/core/services/spinner.service';
import { Location } from '@angular/common';
import { AuthService } from '../app-modules/core/services/auth.service';
import { ConfirmationService } from '../app-modules/core/services/confirmation.service';

@Component({
  selector: 'app-redir-open',
  templateUrl: './redir-open.component.html',
  styleUrls: ['./redir-open.component.css'],
})
export class RedirOpenComponent implements OnInit {
  externalSession = {
    protocol: '',
    host: '',
    fallbackURL: '',
    returnURL: '',
    parentApp: '',
    auth: '',
    username: '',
  };

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.extractExternalSessionDetailsFromUrl();
    this.setRouteStrate();
  }
  setRouteStrate() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.spinnerService.show();
      } else if (event instanceof NavigationEnd) {
        setTimeout(() => this.spinnerService.hide(), 500);
      } else if (event instanceof NavigationError) {
        setTimeout(() => this.spinnerService.hide(), 500);
      } else {
        setTimeout(() => this.spinnerService.hide());
      }
    });
  }

  extractExternalSessionDetailsFromUrl() {
    const params = this.route.snapshot.queryParams;
    this.externalSession.protocol =
      params['protocol'] === 'undefined' ? undefined : params['protocol'];
    this.externalSession.host =
      params['host'] === 'undefined' ? undefined : params['host'];
    this.externalSession.fallbackURL =
      params['fallback'] === 'undefined' ? undefined : params['fallback'];
    this.externalSession.returnURL =
      params['back'] === 'undefined' ? undefined : params['back'];
    this.externalSession.parentApp =
      params['app'] === 'undefined' ? undefined : params['app'];
    this.externalSession.auth =
      params['user'] === 'undefined' ? undefined : params['user'];
    if (this.externalSession && this.externalSession.auth) {
      sessionStorage.setItem('tm-key', this.externalSession.auth);
      sessionStorage.setItem(
        'tm-parentLogin',
        `${this.externalSession.protocol}//${this.externalSession.host}`,
      );
      this.validateSessionKey();
    } else {
      this.confirmationService
        .alert("Can't access telemedicine directly")
        .subscribe((res: any) => {
          this.auth.removeExternalSessionData();
          this.location.back();
        });
    }
  }

  validateSessionKey() {
    this.authService.validateSessionKey().subscribe({
      next: (res: any) => {
        if (res.statusCode === 200 && res.data) {
          const TMPrevilegeObj = res.data.previlegeObj.filter(
            (previlege: any) => {
              if (
                previlege.roles[0].serviceRoleScreenMappings[0]
                  .providerServiceMapping.serviceID === 4
              ) {
                return previlege;
              }
            },
          );

          if (TMPrevilegeObj && TMPrevilegeObj.length > 0) {
            const roles = this.getUserRoles(TMPrevilegeObj[0]);
            const designation = this.getUserDesignation(res.data);

            const providerServiceMapID = TMPrevilegeObj[0].providerServiceMapID;
            sessionStorage.setItem(
              'apimanClientKey',
              TMPrevilegeObj[0].apimanClientKey,
            );
            const userName = res.data.userName;
            const userID = res.data.userID;
            this.storeExernalSessionData(this.externalSession, {
              providerServiceMapID,
              userName,
              designation,
              userID,
              roles,
            });
            if (
              roles.length === 1 &&
              roles[0] === 'Supervisor' &&
              designation === 'Supervisor'
            ) {
              this.router.navigate(['/telemedicine/myStaff']);
            } else {
              this.router.navigate(['/telemedicine/timesheet/', designation]);
            }
          } else {
            this.goBackToOrigin("Don't have previlege for TM");
          }
        } else {
          this.goBackToOrigin(res.errorMessage);
        }
      },
      error: (error) => {
        this.goBackToOrigin(error);
      },
    });
  }

  goBackToOrigin(error: any) {
    this.confirmationService.alert(error, 'error').subscribe((res: any) => {
      this.auth.removeExternalSessionData();
      this.location.back();
    });
  }

  storeExernalSessionData(externalSession: any, loginResponse: any) {
    sessionStorage.setItem(
      'tm-fallback',
      `${this.externalSession.protocol}//${this.externalSession.host}#${this.externalSession.fallbackURL}`,
    );
    sessionStorage.setItem(
      'tm-return',
      `${this.externalSession.protocol}//${this.externalSession.host}#${this.externalSession.returnURL}`,
    );
    sessionStorage.setItem(
      'tm-parentLogin',
      `${this.externalSession.protocol}//${this.externalSession.host}`,
    );
    sessionStorage.setItem('tm-host', `${this.externalSession.parentApp}`);
    sessionStorage.setItem('tm-key', this.externalSession.auth);
    sessionStorage.setItem('tm-isAuthenticated', 'true');

    localStorage.setItem('tm-roles', JSON.stringify(loginResponse.roles));
    localStorage.setItem('tm-designation', loginResponse.designation);
    localStorage.setItem('tm-userName', loginResponse.userName);
    localStorage.setItem(
      'tm-providerServiceMapID',
      loginResponse.providerServiceMapID,
    );
    localStorage.setItem('tm-userID', loginResponse.userID);
  }

  checkUserRolesAndDesignation(roles: any, designation: any) {
    if (roles && roles.includes(designation)) {
      return true;
    }
    return false;
  }

  getUserRoles(serviceData: any) {
    const roleArray: any[] = [];
    if (serviceData && serviceData.roles) {
      const rolesData = serviceData.roles;
      rolesData.forEach((role: any) => {
        if (role && role.serviceRoleScreenMappings) {
          role.serviceRoleScreenMappings.forEach((serviceRole: any) => {
            if (
              serviceRole &&
              serviceRole.screen &&
              serviceRole.screen.screenName
            )
              roleArray.push(serviceRole.screen.screenName);
          });
        }
      });
    }
    return roleArray;
  }

  getUserDesignation(loginDataResponse: any) {
    let designation;
    if (
      loginDataResponse.designation &&
      loginDataResponse.designation.designationName
    ) {
      designation = loginDataResponse.designation.designationName;
    }
    return designation;
  }
}
