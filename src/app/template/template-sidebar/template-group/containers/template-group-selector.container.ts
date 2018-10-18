import { Component, Inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseTemplateModel } from '../../../shared';
import { configSelectors, State } from '../../../../root-store';
import * as templateActions from '../../../../reducers/templates/redux/template.actions';
import * as fromTemplates from '../../../../reducers/templates/redux/template.reducers';

@Component({
  selector: 'cs-template-group-selector-container',
  template: `
    <cs-template-group-selector
      [template]="template$ | async"
      [groups]="imageGroups$ | async"
      (groupReset)="onGroupReset($event)"
      (groupChange)="onGroupChange($event)"
      (cancel)="onCancel()"
    ></cs-template-group-selector>`,
})
export class TemplateGroupSelectorContainerComponent {
  readonly imageGroups$ = this.store.pipe(select(configSelectors.get('imageGroups')));
  readonly template$ = this.store.pipe(select(fromTemplates.getSelectedTemplate));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TemplateGroupSelectorContainerComponent>,
    private store: Store<State>,
  ) {}

  public onGroupChange(templateGroupSettings: { template; templateGroup }) {
    this.store.dispatch(new templateActions.SetTemplateGroup(templateGroupSettings));
    this.dialogRef.close();
  }

  public onGroupReset(template: BaseTemplateModel) {
    this.store.dispatch(new templateActions.ResetTemplateGroup(template));
    this.dialogRef.close();
  }

  public onCancel() {
    this.dialogRef.close();
  }
}
