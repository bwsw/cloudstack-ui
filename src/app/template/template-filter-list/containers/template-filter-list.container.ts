import { Component } from '@angular/core';
import * as templateGroups from '../../../reducers/templates/redux/template-group.reducers';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cs-template-filter-list-container',
  template: `<cs-template-filter-list [groups]="groups$ | async"></cs-template-filter-list>`
})
export class TemplateFilterListContainerComponent {
  readonly groups$ = this.store.select(templateGroups.selectEntities);

  constructor(private store: Store<State>) {
  }
}
