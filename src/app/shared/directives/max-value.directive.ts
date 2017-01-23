import { Validators, Validator, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Directive, Attribute } from '@angular/core';
import { maxMinValidator } from './max-min-validator';


@Directive({
  // tslint:disable-next-line
  selector: '[maxValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxValueValidatorDirective, multi: true }
  ]
})
export class MaxValueValidatorDirective implements Validator {
  private validator = Validators.nullValidator;

  constructor(@Attribute('maxValue') public maxValue: string) {
    this.validator = maxMinValidator(this.maxValue, true);
  }

  public validate(c: FormControl) {
    return this.validator(c);
  }
}

