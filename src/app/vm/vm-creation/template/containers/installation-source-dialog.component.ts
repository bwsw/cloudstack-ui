import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';

import { BaseTemplateModel } from '../../../../template/shared';
import { configSelectors, State } from '../../../../root-store';
import * as fromTemplates from '../../../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-installation-source-dialog',
  template: `
    <cs-vm-creation-template-dialog
      [templates]="templates$ | async"
      [selectedTypes]="selectedTypes$  | async"
      [selectedOsFamilies]="selectedOsFamilies$  | async"
      [selectedGroups]="selectedGroups$  | async"
      [viewMode]="viewMode$  | async"
      [query]="query$  | async"
      [groups]="groups$  | async"
      [isLoading]="isLoading$  | async"
      [preselectedTemplate]="preselectedTemplate"
      (viewModeChange)="onViewModeChange($event)"
      (selectedTypesChange)="onSelectedTypesChange($event)"
      (selectedOsFamiliesChange)="onSelectedOsFamiliesChange($event)"
      (selectedGroupsChange)="onSelectedGroupsChange($event)"
      (queryChange)="onQueryChange($event)"
      (cancel)="onCancel()"
      (selectionChange)="onSelect($event)"
    ></cs-vm-creation-template-dialog>
  `,
})
export class InstallationSourceDialogComponent {
  readonly templates$ = this.store.pipe(select(fromTemplates.selectFilteredTemplatesForVmCreation));
  readonly isLoading$ = this.store.pipe(select(fromTemplates.isLoading));
  readonly groups$ = this.store.pipe(select(configSelectors.get('imageGroups')));
  readonly viewMode$ = this.store.pipe(select(fromTemplates.vmCreationListViewMode));
  readonly selectedTypes$ = this.store.pipe(select(fromTemplates.vmCreationListSelectedTypes));
  readonly selectedOsFamilies$ = this.store.pipe(
    select(fromTemplates.vmCreationListSelectedOsFamilies),
  );
  readonly selectedGroups$ = this.store.pipe(select(fromTemplates.vmCreationListSelectedGroups));
  readonly query$ = this.store.pipe(select(fromTemplates.vmCreationListQuery));

  public preselectedTemplate: BaseTemplateModel;

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<InstallationSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.preselectedTemplate = data.template;
  }

  public onViewModeChange(selectedViewMode: string) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedViewMode }));
  }

  public onSelectedTypesChange(selectedTypes: string[]) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedTypes }));
  }

  public onSelectedOsFamiliesChange(selectedOsFamilies: string[]) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedOsFamilies }));
  }

  public onSelectedGroupsChange(selectedGroups: string[]) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedGroups }));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ query }));
  }

  public onSelect(template: BaseTemplateModel) {
    this.dialogRef.close(template);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
