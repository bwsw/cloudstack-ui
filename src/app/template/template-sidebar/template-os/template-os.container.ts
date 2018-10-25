import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { State } from '../../../reducers/index';
import { select, Store } from '@ngrx/store';

import * as fromOsTypes from '../../../reducers/templates/redux/ostype.reducers';

@Component({
  selector: 'cs-template-os-container',
  template: `
    <cs-template-os [template]="template" [osTypes]="osTypes$ | async"></cs-template-os>`,
})
export class TemplateOsContainerComponent {
  public osTypes$ = this.store.pipe(select(fromOsTypes.selectEntities));
  @Input()
  public template: BaseTemplateModel;

  constructor(public store: Store<State>) {}
}
