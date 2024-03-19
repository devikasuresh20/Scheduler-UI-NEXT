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
import { Directive, HostListener, Input } from '@angular/core';
@Directive({
  selector:
    '[appAllowText][formControlName],[appAllowText][formControl],[appAllowText][ngModel],[appAllowText]',
})
export class StringValidatorDirective {
  @Input()
  allowText!: string;

  alphabet = /^[a-zA-Z]+$/;
  alphaspace = /^[a-zA-Z ]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  alphanumericspace = /^[a-zA-Z0-9 ]+$/;
  alphanumerichyphen = /^[a-zA-Z0-9-/ ]+$/;
  numerichyphen = /^[0-9- ]+$/;
  number = /^[0-9]+$/;
  // decimal = /^[0-9.]+$/;
  decimal = /^\d+(\.\d{0,2})?$/;
  numberslash = /^[0-9/]+$/;
  address = /^[a-zA-Z0-9-./,# ]+$/;

  lastValue = null;
  result!: boolean;
  validate(input: any) {
    const patternCode = this.allowText.trim();

    if (input === null || input === '') return false;

    switch (patternCode) {
      case 'alphabet':
        this.result = this.alphabet.test(input);
        break;
      case 'alphaspace':
        this.result = this.alphaspace.test(input);
        break;
      case 'alphanumeric':
        this.result = this.alphanumeric.test(input);
        break;
      case 'alphanumericspace':
        this.result = this.alphanumericspace.test(input);
        break;
      case 'number':
        this.result = this.number.test(input);
        break;
      case 'numberslash':
        this.result = this.numberslash.test(input);
        break;
      case 'alphanumerichyphen':
        this.result = this.alphanumerichyphen.test(input);
        break;
      case 'numerichyphen':
        this.result = this.numerichyphen.test(input);
        break;
      case 'decimal':
        this.result = this.decimal.test(input);
        break;
      case 'address':
        this.result = this.address.test(input);
        break;
      default:
        this.result = false;
    }
    return this.result;
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const val = event.target.value;
    const lastVal = this.lastValue;
    const maxlength = event.target.maxLength;

    if (this.allowText.trim() === 'decimal') {
      if (val === '') {
        event.target.value = '';
      } else if (!this.validate(val)) {
        event.target.value = lastVal;
      }
    } else {
      const inserted = this.findDelta(val, lastVal);
      // get removed chars
      const removed = this.findDelta(lastVal, val);
      // determine if user pasted content
      const pasted = inserted.length >= 1 || (!inserted && !removed);

      if (maxlength > 0 && val.length > maxlength) {
        event.target.value = lastVal;
      } else {
        if (pasted) {
          if (!this.isValidString(val)) event.target.value = lastVal;
        } else if (!removed) {
          if (!this.isValidChar(inserted)) event.target.value = lastVal;
        }
      }
    }
    this.lastValue = event.target.value;
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any) {
    const input = event.target.value;
    this.lastValue = input;
  }

  findDelta(value: any, prevValue: any) {
    let delta = '';

    for (let i = 0; i < value.length; i++) {
      const str =
        value.substr(0, i) + value.substr(i + value.length - prevValue.length);

      if (str === prevValue)
        delta = value.substr(i, value.length - prevValue.length);
    }

    return delta;
  }

  isValidChar(c: any) {
    return this.validate(c);
  }

  isValidString(str: any) {
    for (let i = 0; i < str.length; i++)
      if (!this.isValidChar(str.substr(i, 1))) return false;
    return true;
  }
}
