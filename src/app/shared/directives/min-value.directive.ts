import { Validators, Validator, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Directive, Attribute } from '@angular/core';
import { maxMinValidator } from './max-min-validator';


@Directive({
  // tslint:disable-next-line
  selector: '[minValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MinValueValidatorDirective, multi: true }
  ]
})
export class MinValueValidatorDirective implements Validator {
  private validator = Validators.nullValidator;

  constructor(@Attribute('minValue') public minValue: string) {
    this.validator = maxMinValidator(this.minValue, false);
  }

  public validate(c: FormControl) {
    return this.validator(c);
  }
}


