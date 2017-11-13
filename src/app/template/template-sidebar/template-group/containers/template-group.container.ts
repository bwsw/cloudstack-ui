import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';

import * as templateActions from '../../../redux/template.actions';
import * as fromTemplates from '../../../redux/template.reducers';
import * as fromTemplateGroups from '../../../redux/template-group.reducers';
import * as templateGroupActions from '../../../redux/template-group.actions';

@Component({
  selector: 'cs-template-group-container',
  template: `
    <cs-template-group
      [template]="template$ | async"
      [groups]="templateGroups$ | async"
      (groupChange)="onGroupChange()"
    ></cs-template-group>`
})
export class TemplateGroupContainerComponent implements OnInit {
  readonly templateGroups$ = this.store.select(fromTemplateGroups.selectEntities);
  readonly template$ = this.store.select(fromTemplates.getSelectedTemplate);

  constructor(private store: Store<State>) {
  }

  public ngOnInit() {
    this.store.dispatch(new templateGroupActions.LoadTemplateGroupsRequest());
  }

  public onGroupChange() {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({}));
  }
}
