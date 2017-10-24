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
      (onCreateTemplate)="templateCreated($event)"
    ></cs-template-creation>`
})
export class TemplateCreationContainerComponent {
  readonly viewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);
  readonly osTypes$ = this.store.select(fromOsTypes.osTypes);
  readonly zones$ = this.store.select(fromZones.zones);

  constructor(private store: Store<State>) {
  }

  public templateCreated(template) {
    this.store.dispatch(new templateActions.CreateTemplateSuccess(template));
  }
}

