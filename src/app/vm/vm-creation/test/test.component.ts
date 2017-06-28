import { Component } from '@angular/core';
import { FieldService } from '../form/field.service';


@Component({
  selector: 'cs-test',
  templateUrl: 'test.component.html'
})
export class TestComponent {
  public fields: Array<any>;

  constructor (public fieldService: FieldService) {
    this.fields = fieldService.getFields();
  }
}
