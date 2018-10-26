import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CidrUtils } from '../../../shared/utils/cidr-utils';

export function cidrValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = CidrUtils.isCidrValid(control.value);
    return isValid ? null : { cidrValidator: { value: control.value } };
  };
}
