import { Validators, Validator, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { maxMinValidator } from './max-min-validator';


@Directive({
  // tslint:disable-next-line
  selector: '[maxValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxValueValidatorDirective, multi: true }
  ]
})
export class MaxValueValidatorDirective implements OnInit, Validator {
  @Input() public maxValue: string;
  private validator = Validators.nullValidator;

  public ngOnInit(): void {
    this.validator = maxMinValidator(this.maxValue, true);
  }

  public validate(c: FormControl) {
    return this.validator(c);
  }
}

