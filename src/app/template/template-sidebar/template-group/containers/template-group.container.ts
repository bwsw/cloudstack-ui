import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { configSelectors, State } from '../../../../root-store';
import * as templateActions from '../../../../reducers/templates/redux/template.actions';
import * as fromTemplates from '../../../../reducers/templates/redux/template.reducers';
import { BaseTemplateModel } from '../../../shared/base-template.model';

@Component({
  selector: 'cs-template-group-container',
  template: `
    <cs-template-group
      [template]="template$ | async"
      [groups]="imageGroups$ | async"
      (groupChange)="onGroupChange($event)"
      (groupReset)="onGroupReset()"
    ></cs-template-group>`,
})
export class TemplateGroupContainerComponent {
  readonly imageGroups$ = this.store.pipe(select(configSelectors.get('imageGroups')));
  readonly template$ = this.store.pipe(select(fromTemplates.getSelectedTemplate));

  constructor(private store: Store<State>) {}

  public onGroupChange(template: BaseTemplateModel) {
    this.store.dispatch(new templateActions.UpdateTemplate(template));
  }

  public onGroupReset() {
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
  }
}
