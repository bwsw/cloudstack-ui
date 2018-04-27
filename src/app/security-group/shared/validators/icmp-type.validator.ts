import { AbstractControl, ValidatorFn } from '@angular/forms';
import { icmpV4Types, icmpV6Types } from '../../../shared/icmp/icmp-types';

export function icmpV4TypeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const type = +control.value;
    const index = icmpV4Types.findIndex(value => value.type === type);
    return index > -1 ? null : { 'icmpV4TypeValidator': { value: control.value } };
  }
}

export function icmpV6TypeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const type = +control.value;
    const index = icmpV6Types.findIndex(value => value.type === type);
    return index > -1 ? null : { 'icmpV6TypeValidator': { value: control.value } };
  }
}
