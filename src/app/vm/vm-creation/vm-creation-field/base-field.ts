import { ValidatorFn } from '@angular/forms';


export class BaseField<T> {
  public value: T;
  public key: string;
  public label: string;
  public required: boolean;
  public pattern: string;
  public order: number;
  public controlType: string;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    pattern?: string,
    order?: number,
    controlType?: string
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
  }

  public get validators(): Array<ValidatorFn> {
    return [];
  }
}
