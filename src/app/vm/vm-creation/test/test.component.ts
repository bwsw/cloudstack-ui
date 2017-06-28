import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FieldService } from '../form/field.service';
import { BaseField } from '../form/fields/base-field';
import { VmCreationData } from '../data/vm-creation-data';
import { VmCreationService } from '../vm-creation.service';
import { VmCreationFilterService } from '../data/vm-creation-filter.service';


@Component({
  selector: 'cs-test',
  templateUrl: 'test.component.html'
})
export class TestComponent implements OnInit {
  public fields: Array<BaseField<any>>;
  private data: VmCreationData;

  constructor (
    private fieldService: FieldService,
    private vmCreationFilterService: VmCreationFilterService,
    private vmCreationService: VmCreationService
  ) {}

  public ngOnInit(): void {
    this.vmCreationService.getData().subscribe(data => {
      this.data = data;
      this.fields = this.fieldService.getFields(data);
    });
  }

  public subscribeToFormChanges(form: FormGroup): void {
    const changes = Object.values(form.controls).map(control => control.valueChanges);
    Observable.merge(...changes).subscribe(_ => this.updateFields());
  }

  private updateFields(): void {
    this.fields = this.fieldService.getFields(this.vmCreationFilterService.filter(this.data));
  }
}
