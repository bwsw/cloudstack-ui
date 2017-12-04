import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';

import * as fromTemplates from '../../../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-vm-creation-template-container',
  template: `
    <cs-vm-creation-template
      name="template"
      class="template-select"
      [templates]="templates$ | async"
      [ngModel]="template"
      (change)="change.emit($event)"
    ></cs-vm-creation-template>`
})
export class VmCreationTemplateContainerComponent implements OnInit {
  readonly templates$ = this.store.select(fromTemplates.selectTemplatesForVmCreation);

  @Input() public template: BaseTemplateModel;

  @Input()
  public set zoneId(value: string) {
    this.store.dispatch(new templateActions.DialogLoadTemplatesRequest(value));
  }

  @Output() public change = new EventEmitter<BaseTemplateModel>();

  constructor(private store: Store<State>) {
  }

  public ngOnInit() {
    this.templates$.subscribe(templates => {
      if (!this.template && templates.length) {
        this.change.emit(templates[0]);
      }
    });
  }
}
