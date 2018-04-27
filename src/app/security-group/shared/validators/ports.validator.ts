import { AbstractControl, ValidatorFn } from '@angular/forms';

export function startPortValidator(endPort: AbstractControl): ValidatorFn {
  return (startPort: AbstractControl): { [key: string]: any } => {
    if (startPort.value > endPort.value && endPort.touched) {
      return { 'startPortValidator': { endPort: endPort.value, actual: startPort.value } };
    }
    return null;
  }
}

export function endPortValidator(startPort: AbstractControl): ValidatorFn {
  return (endPort: AbstractControl): { [key: string]: any } => {
    if (startPort.value > endPort.value && startPort.touched) {
      return { 'endPortValidator': { startPort: startPort.value, actual: endPort.value } };
    }
    return null;
  }
}
