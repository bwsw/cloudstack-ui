import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './fields/base-field';


@Component({
  selector: 'cs-vm-creation-field',
  templateUrl: 'field.component.html'
})
export class VmCreationFieldComponent {
  @Input() public field: BaseField<any>;
  @Input() public form: FormGroup;

  public get isValid(): boolean {
    return this.form.controls[this.field.key].valid;
  }
}
