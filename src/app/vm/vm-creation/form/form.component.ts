import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './fields/base-field';
import { FieldControlService } from './field-control.service';


@Component({
  selector: 'cs-vm-creation-form',
  templateUrl: 'form.component.html'
})
export class VmCreationFormComponent implements OnInit {
  @Input() public fields: Array<BaseField<any>> = [];
  @Output() public formEmitter: EventEmitter<FormGroup>;
  public form: FormGroup;

  constructor(private fieldControlService: FieldControlService) {
    this.formEmitter = new EventEmitter();
  }

  public ngOnInit(): void {
    this.form = this.fieldControlService.toFormGroup(this.fields);
    this.formEmitter.emit(this.form);
  }

  public onSubmit(): string {
    return JSON.stringify(this.form.value);
  }
}
