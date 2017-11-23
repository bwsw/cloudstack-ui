import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';

import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';

@Component({
  selector: 'cs-template-details-container',
  template: `
    <cs-iso-zones
      [entity]="template$ | async"
    ></cs-iso-zones>`
})
export class IsoZonesContainerComponent {
  public template$ = this.store.select(fromTemplates.getSelectedTemplate);

  constructor(private store: Store<State>) {
  }
}
