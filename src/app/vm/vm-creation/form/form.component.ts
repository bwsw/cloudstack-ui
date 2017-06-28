import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './fields/base-field';
import { FieldControlService } from './field-control.service';


@Component({
  selector: 'cs-vm-creation-form',
  templateUrl: 'form.component.html'
})
export class VmCreationFormComponent implements OnInit {
  @Input() public fields: Array<BaseField<any>> = [];
  public form: FormGroup;

  constructor(private fieldControlService: FieldControlService) {}

  public ngOnInit(): void {
    this.form = this.fieldControlService.toFormGroup(this.fields);
  }

  public onSubmit(): string {
    return JSON.stringify(this.form.value);
  }
}
