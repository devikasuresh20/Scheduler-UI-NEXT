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
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => myEmailDirective),
      multi: true,
    },
  ],
})
export class myEmailDirective implements Validator {
  pattern =
    /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|in|co.in|ORG|COM|IN|CO.IN)\b$/;
  validate(control: AbstractControl): { [key: string]: any } | null {
    const input = control.value;
    if (input == '' || input == null) return null;

    const flag = this.pattern.test(input);
    return flag
      ? null
      : {
          valid: false,
        };
  }
}
