import { Directive, Input, OnInit } from '@angular/core';
import { FormControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';
import { forbiddenValuesValidator } from './forbidden-values-validator';

@Directive({
  // tslint:disable-next-line
  selector: '[forbiddenValues]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValuesDirective, multi: true }],
})
export class ForbiddenValuesDirective implements OnInit, Validator {
  @Input()
  public forbiddenValues: string[];
  private validator = Validators.nullValidator;

  public ngOnInit(): void {
    this.validator = forbiddenValuesValidator(this.forbiddenValues);
  }

  public validate(c: FormControl): { [key: string]: any } {
    return this.validator(c);
  }
}
