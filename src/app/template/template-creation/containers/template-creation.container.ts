import { Component } from '@angular/core';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromTemplates from '../../redux/template.reducers';
import * as fromOsTypes from '../../redux/ostype.reducers';
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
    ></cs-template-creation>`
})
export class TemplateCreationContainerComponent {
  readonly viewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);
  readonly osTypes$ = this.store.select(fromOsTypes.selectAll);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly loading$ = this.store.select(fromTemplates.isLoading);

  constructor(private store: Store<State>) {
  }

  public onCreate(params) {
    this.store.dispatch(new templateActions.CreateTemplate(params));
  }
}

