import { AbstractControl, ValidatorFn } from '@angular/forms';


export function forbiddenValuesValidator(
  forbiddenValues: Array<string>
): ValidatorFn {
  return (c: AbstractControl) => {
    const isValid = !forbiddenValues.find(_ => _ === c.value);

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
