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
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class BeneficiaryDetailsService {
  beneficiaryDetails = new BehaviorSubject<any>(null);
  beneficiaryDetails$ = this.beneficiaryDetails.asObservable();

  constructor(private http: HttpClient) {}

  getBeneficiaryDetails(beneficiaryRegID: string, benFlowID: string) {
    this.http
      .post(environment.getBeneficiaryDetail, {
        beneficiaryRegID: beneficiaryRegID,
        benFlowID: benFlowID,
      })
      .subscribe({
        next: (res: any) => {
          if (res.json().data) {
            this.beneficiaryDetails.next(res.json().data);
          }
        },
        error: (err) => {
          this.beneficiaryDetails.next(null);
        },
      });
  }

  getBeneficiaryImage(beneficiaryRegID: string) {
    return this.http.post(environment.getBeneficiaryImage, {
      beneficiaryRegID: beneficiaryRegID,
    });
    // .map((res : any)=> res.json().data);
  }

  reset() {
    this.beneficiaryDetails.next(null);
  }
}
