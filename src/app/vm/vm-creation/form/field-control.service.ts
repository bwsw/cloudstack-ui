import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseField } from './fields/base-field';


@Injectable()
export class FieldControlService {
  public toFormGroup(fields: Array<BaseField<any>>): FormGroup {
    let group: any = {};

    fields.forEach(field => {
      group[field.key] = new FormControl(field.value, field.validators);
    });

    return new FormGroup(group);
  }
}
