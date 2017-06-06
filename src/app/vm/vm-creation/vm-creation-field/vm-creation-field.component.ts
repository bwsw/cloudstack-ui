import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './base-field';


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
