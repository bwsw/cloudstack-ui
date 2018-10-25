import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startPortValidator(endPort: AbstractControl): ValidatorFn {
  return (startPort: AbstractControl): ValidationErrors | null => {
    if (startPort.value > endPort.value && endPort.touched) {
      return { startPortValidator: { endPort: endPort.value, actual: startPort.value } };
    }
    return null;
  };
}

export function endPortValidator(startPort: AbstractControl): ValidatorFn {
  return (endPort: AbstractControl): ValidationErrors | null => {
    if (startPort.value > endPort.value && startPort.touched) {
      return { endPortValidator: { startPort: startPort.value, actual: endPort.value } };
    }
    return null;
  };
}
