import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../../reducers/index';

import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';

@Component({
  selector: 'cs-template-details-container',
  template: `
    <cs-iso-zones
      [entity]="template$ | async"
    ></cs-iso-zones>`,
})
export class IsoZonesContainerComponent {
  public template$ = this.store.pipe(select(fromTemplates.getSelectedTemplate));

  constructor(private store: Store<State>) {}
}
