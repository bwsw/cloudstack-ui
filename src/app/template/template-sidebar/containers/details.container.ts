import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';

import * as fromTemplates from '../../redux/template.reducers';

@Component({
  selector: 'cs-template-details-container',
  template: `
    <cs-template-details
      [entity]="template$ | async"
    ></cs-template-details>`
})
export class DetailsContainerComponent {
  public template$ = this.store.select(fromTemplates.getSelectedTemplate);

  constructor(private store: Store<State>) {
  }

}
