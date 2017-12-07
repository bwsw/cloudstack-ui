import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';

import * as fromTemplates from '../../../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-vm-creation-template-container',
  template: `
    <cs-vm-creation-template
      name="template"
      class="template-select"
      [ngModel]="template"
      (change)="change.emit($event)"
    ></cs-vm-creation-template>`
})
export class VmCreationTemplateContainerComponent {
  // readonly templates$ = this.store.select(fromTemplates.selectTemplatesForVmCreation);
  @Input() public template: BaseTemplateModel;
  @Output() public change = new EventEmitter<BaseTemplateModel>();

  constructor(private store: Store<State>) {
  }
}
