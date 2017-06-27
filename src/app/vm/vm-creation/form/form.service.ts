import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseField } from './base-field';


@Injectable()
export class FormService {
  public toFormGroup(fields: Array<BaseField<any>>): FormGroup {
    let group: any = {};

    fields.forEach(field => {
      group[field.key] = new FormControl(field.value, field.validators);
    });

    return new FormGroup(group);
  }
}
