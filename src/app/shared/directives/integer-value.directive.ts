import { FormControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';
import { Directive, OnInit } from '@angular/core';
import { integerValidator } from './integer-validator';

@Directive({
  // tslint:disable-next-line
  selector: '[integerValue]',
  providers: [{ provide: NG_VALIDATORS, useExisting: IntegerValidatorDirective, multi: true }],
})
export class IntegerValidatorDirective implements OnInit, Validator {
  private validator = Validators.nullValidator;

  public ngOnInit(): void {
    this.validator = integerValidator();
  }

  public validate(c: FormControl): { [key: string]: any } {
    return this.validator(c);
  }
}
