import { AbstractControl, ValidatorFn } from '@angular/forms';

export function forbiddenValuesValidator(forbiddenValues: string[]): ValidatorFn {
  return (c: AbstractControl) => {
    const isValid = !forbiddenValues.find(_ => _ === c.value && c.value.trim());

    if (isValid) {
      return null;
    }
    return {
      forbiddenValuesValidator: {
        valid: false,
      },
    };
  };
}
