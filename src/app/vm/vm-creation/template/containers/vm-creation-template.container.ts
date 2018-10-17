import { select, Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';

import * as fromTemplates from '../../../../reducers/templates/redux/template.reducers';

@Component({
  selector: 'cs-vm-creation-template-container',
  template: `
    <cs-vm-creation-template
      name="template"
      class="template-select"
      [ngModel]="template"
      (changed)="changed.emit($event)"
      [templates]="templates$ | async"
      [numberOfTemplates]="numberOfTemplates$ | async"
    ></cs-vm-creation-template>`,
})
export class VmCreationTemplateContainerComponent {
  readonly templates$ = this.store.pipe(select(fromTemplates.selectFilteredTemplatesForVmCreation));
  readonly numberOfTemplates$ = this.store.pipe(
    select(fromTemplates.numOfTemplatesReadyForVmCreation),
  );
  @Input()
  public template: BaseTemplateModel;
  @Output()
  public changed = new EventEmitter<BaseTemplateModel>();

  constructor(private store: Store<State>) {}
}
