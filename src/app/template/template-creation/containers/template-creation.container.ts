import { Component } from '@angular/core';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromTemplates from '../../redux/template.reducers';
import * as fromOsTypes from '../../redux/ostype.reducers';
import * as fromTemplateGroups from '../../redux/template-group.reducers';
import * as fromZones from '../../redux/zone.reducers';
import * as templateActions from '../../redux/template.actions';


@Component({
  selector: 'cs-template-create-dialog-container',
  template: `
    <cs-template-creation
      [mode]="viewMode$ | async"
      [osTypes]="osTypes$ | async"
      [zones]="zones$ | async"
      [isLoading]="loading$ | async"
      (onCreateTemplate)="onCreate($event)"
      [groups]="groups$ | async"
    ></cs-template-creation>`
})
export class TemplateCreationContainerComponent {
  readonly viewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);
  readonly osTypes$ = this.store.select(fromOsTypes.selectAll);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly loading$ = this.store.select(fromTemplates.isLoading);
  readonly groups$ = this.store.select(fromTemplateGroups.selectAll);

  constructor(private store: Store<State>) {
  }

  public onCreate(params) {
    this.store.dispatch(new templateActions.CreateTemplate(params));
  }
}

