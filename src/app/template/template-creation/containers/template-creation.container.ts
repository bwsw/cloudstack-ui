import { Component, Inject } from '@angular/core';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromTemplates from '../../redux/template.reducers';
import * as fromOsTypes from '../../redux/ostype.reducers';
import * as fromTemplateGroups from '../../redux/template-group.reducers';
import * as fromZones from '../../redux/zone.reducers';
import * as templateActions from '../../redux/template.actions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Snapshot } from '../../../shared/models/snapshot.model';


@Component({
  selector: 'cs-template-create-dialog-container',
  template: `
    <cs-template-creation
      [mode]="viewMode$ | async"
      [osTypes]="osTypes$ | async"
      [zones]="zones$ | async"
      [isLoading]="loading$ | async"
      [groups]="groups$ | async"
      [snapshot]="snapshot"
      (onCreateTemplate)="onCreate($event)"
    ></cs-template-creation>`
})
export class TemplateCreationContainerComponent {
  readonly viewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);
  readonly osTypes$ = this.store.select(fromOsTypes.selectAll);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly loading$ = this.store.select(fromTemplates.isLoading);
  readonly groups$ = this.store.select(fromTemplateGroups.selectAll);

  public snapshot: Snapshot;

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<TemplateCreationContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.snapshot = data.snapshot;
  }

  public onCreate(params) {
    this.store.dispatch(new templateActions.CreateTemplate(params));
    this.dialogRef.close();
  }
}

