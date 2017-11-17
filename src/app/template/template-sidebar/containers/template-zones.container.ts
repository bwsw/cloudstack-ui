import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';

import * as fromTemplates from '../../redux/template.reducers';

@Component({
  selector: 'cs-template-details-container',
  template: `
    <cs-template-zones
      [entity]="template$ | async"
    ></cs-template-zones>`
})
export class TemplateZonesContainerComponent implements AfterViewInit {
  public template$ = this.store.select(fromTemplates.getSelectedTemplate);

  constructor(
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
