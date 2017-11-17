import {
  AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges,
  OnInit
} from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromOsTypes from '../../redux/ostype.reducers';
import * as osTypeActions from '../../redux/ostype.actions';

@Component({
  selector: 'cs-template-os-icon-container',
  template: `
    <cs-template-os-icon
      [template]="template"
      [osTypes]="osTypes$ | async"
    ></cs-template-os-icon>`
})
export class TemplateOsIconContainerComponent implements OnChanges, AfterViewInit {
  public osTypes$ = this.store.select(fromOsTypes.selectEntities);
  @Input() public template: BaseTemplateModel;
  @Input() public dialogMode = false;

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {
  }

  public ngOnChanges(changes) {
    if (changes.dialogMode && this.dialogMode) {
      this.store.dispatch(new osTypeActions.LoadOsTypesRequest());
    }
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
