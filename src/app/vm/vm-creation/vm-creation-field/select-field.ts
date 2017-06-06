import { BaseField } from './base-field';


export class SelectField<T> extends BaseField<T> {
  public controlType = 'select';
  public options: Array<{ value: T }> = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || '';
  }
}
