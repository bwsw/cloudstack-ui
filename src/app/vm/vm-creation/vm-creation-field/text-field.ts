import { BaseField } from './base-field';
import { ValidatorFn, Validators } from '@angular/forms';


export class TextField extends BaseField<string> {
  public controlType = 'textbox';
  public errorMessage: string;
  public type: string;

  public get validators(): Array<ValidatorFn> {
    return [
      ...(this.required ? [Validators.required] : []),
      ...(this.pattern ? [Validators.pattern(this.pattern)] : [])
    ];
  }

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.errorMessage = options['errorMsg'] || '';
  }
}
