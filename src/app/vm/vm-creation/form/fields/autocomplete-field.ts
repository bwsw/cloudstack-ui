import { BaseField } from './base-field';


export class AutocompleteField extends BaseField<string> {
  public controlType = 'autocomplete';
  public options: Array<string> = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || '';
  }
}
