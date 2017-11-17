import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import * as fromTemplates from '../../../../template/redux/template.reducers';
import * as templateActions from '../../../../template/redux/template.actions';

@Component({
  selector: 'cs-vm-creation-template-container',
  template: `
    <cs-vm-creation-template
      [ngModel]="template"
      [zoneId]="zoneId"
      (change)="change.emit($event)"
    ></cs-vm-creation-template>`
})
export class VmCreationTemplateContainerComponent {
  @Input() public zoneId: string;
  @Input() public template: BaseTemplateModel;
  @Output() public change = new EventEmitter<BaseTemplateModel>();

  constructor(private store: Store<State>) {
  }
}
