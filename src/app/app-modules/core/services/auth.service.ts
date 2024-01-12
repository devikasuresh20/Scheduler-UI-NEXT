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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  login(userName: string, password: string) {
    return this.http.post(environment.loginUrl, {
      userName: userName,
      password: password,
    });
    // .map(res => res.json());
  }

  getUserSecurityQuestionsAnswer(uname: any): Observable<any> {
    return this.http.post(environment.getUserSecurityQuestionsAnswerUrl, {
      userName: uname.toLowerCase(),
    });
    // .map(res => res.json().data)
  }

  getSecurityQuestions() {
    return this.http.get(environment.getSecurityQuestionUrl);
    // .map(res => res.json())
  }

  saveUserSecurityQuestionsAnswer(userQuestionAnswer: any) {
    return this.http.post(
      environment.saveUserSecurityQuestionsAnswerUrl,
      userQuestionAnswer,
    );
    // .map(res => res.json())
  }

  setNewPassword(userName: string, password: string) {
    return this.http.post(environment.setNewPasswordUrl, {
      userName: userName,
      password: password,
    });
    // .map(res => res.json())
  }

  logout() {
    return this.http.post(environment.logoutUrl, '');
    // .map((res) => res.json());
  }

  validateSessionKey() {
    return this.http.post(environment.getSessionExistsURL, {});
    // .map(res => res.json());
  }
  getSwymedLogout() {
    return this.http.get(environment.getSwymedLogoutUrl);
    // .map(res => res.json())
    // .catch(err => {
    //   return Observable.throw(err);
    // })
  }
  getUIVersionAndCommitDetails(url: any) {
    return this.http.get(url);
    // .map((res) => res.json());
  }
  getAPIVersionAndCommitDetails() {
    return this.http.get(environment.apiVersionUrl);
    // .map((res) => res.json());
  }
  removeExternalSessionData() {
    sessionStorage.removeItem('tm-fallback');
    sessionStorage.removeItem('tm-return');
    sessionStorage.removeItem('tm-parentLogin');
    sessionStorage.removeItem('tm-host');
    sessionStorage.removeItem('tm-key');
    sessionStorage.removeItem('tm-isAuthenticated');

    localStorage.removeItem('tm-designation');
    localStorage.removeItem('tm-roles');
    localStorage.removeItem('tm-userName');
    localStorage.removeItem('tm-userID');
    localStorage.removeItem('tm-providerServiceMapID');
  }
}
