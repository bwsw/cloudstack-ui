import { Component } from '@angular/core';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';
import * as fromOsTypes from '../../../reducers/templates/redux/ostype.reducers';
import * as fromZones from '../../../reducers/templates/redux/zone.reducers';

import * as templateActions from '../../../reducers/templates/redux/template.actions';


@Component({
  selector: 'cs-template-create-dialog-container',
  template: `
    <cs-template-creation
      [mode]="viewMode$ | async"
      [osTypes]="osTypes$ | async"
      [zones]="zones$ | async"
      (onCreateTemplate)="templateCreated($event)"
    ></cs-template-creation>`
})
export class TemplateCreationContainerComponent {
  readonly viewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);
  readonly osTypes$ = this.store.select(fromOsTypes.selectAll);
  readonly zones$ = this.store.select(fromZones.selectAll);

  constructor(private store: Store<State>) {
  }

  public templateCreated(template) {
    this.store.dispatch(new templateActions.CreateTemplateSuccess(template));
  }
}

