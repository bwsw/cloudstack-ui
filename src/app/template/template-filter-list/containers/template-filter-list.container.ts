import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { configSelectors, State } from '../../../root-store';

@Component({
  selector: 'cs-template-filter-list-container',
  template: `
    <cs-template-filter-list [groups]="groups$ | async"></cs-template-filter-list>`,
})
export class TemplateFilterListContainerComponent {
  readonly groups$ = this.store.pipe(select(configSelectors.get('imageGroups')));

  constructor(private store: Store<State>) {}
}
