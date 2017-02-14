import { Validators, Validator, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { maxMinValidator } from './max-min-validator';


@Directive({
  // tslint:disable-next-line
  selector: '[minValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MinValueValidatorDirective, multi: true }
  ]
})
export class MinValueValidatorDirective implements OnInit, Validator {
  @Input() public minValue: string;
  private validator = Validators.nullValidator;

  public ngOnInit(): void {
    this.validator = maxMinValidator(this.minValue, false);
  }

  public validate(c: FormControl): { [key: string]: any; } {
    return this.validator(c);
  }
}


