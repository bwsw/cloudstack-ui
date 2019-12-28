import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

function isEmpty(val: string | null) {
  return val == null || val.length === 0;
}

@Directive({
  selector: 'input[csValueEqualTo]',
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => ValueEqualToValidatorDirective),
    },
  ],
})
export class ValueEqualToValidatorDirective implements Validator {
  // tslint:disable-next-line:no-input-rename
  @Input('csValueEqualTo') value: string | undefined;

  validate(control: AbstractControl): ValidationErrors | null {
    if (isEmpty(this.value) || isEmpty(control.value)) {
      return null; // to allow optional controls
    }

    return control.value === this.value ? null : this.getValidationError(control);
  }

  private getValidationError(control: AbstractControl): ValidationErrors {
    return { valueEqualTo: { expected: this.value, actual: control.value } };
  }
}
