import { Component, Injectable, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'cs-vm-creation-field',
  templateUrl: 'vm-creation-field.component.html'
})
export class VmCreationFieldComponent {
  @Input() public field: BaseField<any>;
  @Input() public form: FormGroup;

  public get isValid(): boolean {
    return this.form.controls[this.field.key].valid;
  }
}

export class BaseField<T> {
  public value: T;
  public key: string;
  public label: string;
  public required: boolean;
  public order: number;
  public controlType: string;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
  }
}

export class TextField extends BaseField<string> {
  public controlType = 'textbox';
  // public type: string; ?

  constructor(options: {} = {}) {
    super(options);
    // this.type = options['type'] || ''; ?
  }
}

export class SelectField<T> extends BaseField<T> {
  public controlType = 'select';
  public options: { value: T }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || '';
  }
}

@Injectable()
export class VmFormService {
  public toFormGroup(fields: Array<BaseField<any>>): FormGroup {
    let group: any = {};

    fields.forEach(field => {
      group[field.key] =
        field.required ?
          new FormControl(field.value, Validators.required) :
          new FormControl(field.value || '');
    });

    return new FormGroup(group);
  }
}
