import { AbstractControl, ValidatorFn } from '@angular/forms';
import { icmpV4Types, icmpV6Types } from '../../../shared/icmp/icmp-types';

export function icmpV4CodeValidator(icmpV4Type: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const typeObject = icmpV4Types.find(value => value.type === icmpV4Type);
    const code = +control.value;
    const index = typeObject.codes.findIndex(value => value === code);
    return index > -1 ? null : { 'icmpV4CodeValidator': { value: control.value } };
  }
}

export function icmpV6CodeValidator(icmpV6Type: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const typeObject = icmpV6Types.find(value => value.type === icmpV6Type);
    const code = +control.value;
    const index = typeObject.codes.findIndex(value => value === code);
    return index > -1 ? null : { 'icmpV6CodeValidator': { value: control.value } };
  }
}
