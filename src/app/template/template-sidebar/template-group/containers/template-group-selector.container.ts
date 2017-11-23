import {
  Component,
  Inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { BaseTemplateModel } from '../../../shared/base-template.model';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';

import * as templateActions from '../../../../reducers/templates/redux/template.actions';
import * as fromTemplates from '../../../../reducers/templates/redux/template.reducers';
import * as fromTemplateGroups from '../../../../reducers/templates/redux/template-group.reducers';

@Component({
  selector: 'cs-template-group-selector-container',
  template: `
    <cs-template-group-selector
      [template]="template$ | async"
      [groups]="templateGroups$ | async"
      (groupReset)="onGroupReset($event)"
      (groupChange)="onGroupChange($event)"
      (cancel)="onCancel()"
    ></cs-template-group-selector>`
})
export class TemplateGroupSelectorContainerComponent {
  readonly templateGroups$ = this.store.select(fromTemplateGroups.selectEntities);
  readonly template$ = this.store.select(fromTemplates.getSelectedTemplate);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TemplateGroupSelectorContainerComponent>,
    private store: Store<State>
  ) {
  }

  public onGroupChange(templateGroupSettings: { template, templateGroup }) {
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
