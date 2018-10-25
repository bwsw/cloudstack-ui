import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../../shared/base-template.model';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';

import * as templateActions from '../../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-template-actions-sidebar-container',
  template: `
    <cs-template-actions-sidebar
      [template]="template"
      (deleteTemplate)="onTemplateDelete($event)"
    ></cs-template-actions-sidebar>`,
})
export class TemplateActionsSidebarContainerComponent {
  @Input()
  public template: BaseTemplateModel;

  constructor(private store: Store<State>) {}

  public onTemplateDelete(template) {
    this.store.dispatch(new templateActions.RemoveTemplate(template));
  }
}
