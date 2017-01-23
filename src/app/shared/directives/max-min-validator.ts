import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maxMinValidator(value, max: boolean): ValidatorFn {
  return (c: AbstractControl) => {
    let isValid: boolean;
    if (max) {
      isValid = +c.value <= +value;
    } else {
      isValid = +c.value >= +value;
    }

    if (isValid) {
      return null;
    }
    return {
      control: {
        valid: false
      }
    };
  };
}
