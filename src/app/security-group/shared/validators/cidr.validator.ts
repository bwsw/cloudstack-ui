import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Utils } from '../../../shared/services/utils/utils.service';

export function cidrValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isValid = Utils.cidrIsValid(control.value);
    return isValid ? null : { 'cidrValidator': { value: control.value } };
  }
}
