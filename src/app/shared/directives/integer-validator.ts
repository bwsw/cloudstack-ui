import { AbstractControl, ValidatorFn } from '@angular/forms';

export function integerValidator(): ValidatorFn {
  return (c: AbstractControl) => {
    const isValid = Number.isInteger(+c.value);

    if (isValid) {
      return null;
    }
    return {
      integerValidator: {
        valid: false,
      },
    };
  };
}
