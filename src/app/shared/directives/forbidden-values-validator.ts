import { AbstractControl, ValidatorFn } from '@angular/forms';


export function forbiddenValuesValidator(
  forbiddenValues: Array<string>
): ValidatorFn {
  return (c: AbstractControl) => {
    const isValid = c.value && !forbiddenValues.find(_ => _ === c.value.trim());

    if (isValid) {
      return null;
    }
    return {
      forbiddenValuesValidator: {
        valid: false
      }
    };
  };
}
