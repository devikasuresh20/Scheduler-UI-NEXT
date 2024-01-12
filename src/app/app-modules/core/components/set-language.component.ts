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
/*
 * JA354063 - Created on 21-07-21
 */
import { Component } from '@angular/core';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  template: '',
})
export class SetLanguageComponent {
  static currentLanguageObject: any;
  static setLanguage() {
    throw new Error('Method not implemented.');
  }
  currentLanguageObject: any;
  constructor(private httpServices: HttpServiceService) {}

  // ngDoCheck() {
  //   this.setLanguage();
  // }

  setLanguage() {
    const languageSubscription = this.httpServices.currentLangugae$.subscribe({
      next: (languageResponse) => {
        this.currentLanguageObject = languageResponse;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('completed');
      },
    });

    languageSubscription.unsubscribe();
  }
}
