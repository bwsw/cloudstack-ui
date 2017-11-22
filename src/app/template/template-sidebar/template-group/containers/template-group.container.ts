import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';

import * as templateActions from '../../../redux/template.actions';
import * as fromTemplates from '../../../redux/template.reducers';
import * as fromTemplateGroups from '../../../redux/template-group.reducers';
import * as templateGroupActions from '../../../redux/template-group.actions';
import { BaseTemplateModel } from '../../../shared/base-template.model';

@Component({
  selector: 'cs-template-group-container',
  template: `
    <cs-template-group
      [template]="template$ | async"
      [groups]="templateGroups$ | async"
      (groupChange)="onGroupChange($event)"
      (groupReset)="onGroupReset()"
    ></cs-template-group>`
})
export class TemplateGroupContainerComponent {
  readonly templateGroups$ = this.store.select(fromTemplateGroups.selectEntities);
  readonly template$ = this.store.select(fromTemplates.getSelectedTemplate);

  constructor(private store: Store<State>) {
  }

  public onGroupChange(template: BaseTemplateModel) {
    this.store.dispatch(new templateActions.UpdateTemplate(template));
  }

  public onGroupReset() {
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
  }
}
