import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromOsTypes from '../../redux/ostype.reducers';

@Component({
  selector: 'cs-template-os-container',
  template: `
    <cs-template-os [template]="template" [osTypes]="osTypes$ | async"></cs-template-os>`
})
export class TemplateOsContainerComponent {
  public osTypes$ = this.store.select(fromOsTypes.selectAll);
  public entity: BaseTemplateModel;
  @Input() public template: BaseTemplateModel;

  constructor(public store: Store<State>) {
  }
}
