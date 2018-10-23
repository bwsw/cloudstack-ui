import { Component, Inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Snapshot } from '../../../shared/models';
import { CreateTemplateBaseParams } from '../../shared/base-template.service';

import { configSelectors, State } from '../../../root-store';
import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';
import * as fromOsTypes from '../../../reducers/templates/redux/ostype.reducers';
import * as osTypeActions from '../../../reducers/templates/redux/ostype.actions';
import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as fromZones from '../../../reducers/templates/redux/zone.reducers';
import * as zoneActions from '../../../reducers/templates/redux/zone.actions';
import * as templateActions from '../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-template-create-dialog-container',
  template: `
    <cs-template-creation
      [mode]="viewMode$ | async"
      [osTypes]="osTypes$ | async"
      [zones]="zones$ | async"
      [groups]="groups$ | async"
      [snapshot]="snapshot"
      [account]="account$ | async"
      (templateCreated)="onCreate($event)"
    ></cs-template-creation>`,
})
export class TemplateCreationContainerComponent {
  readonly viewMode$ = this.store.pipe(select(fromTemplates.filterSelectedViewMode));
  readonly account$ = this.store.pipe(select(fromAuth.getUserAccount));
  readonly osTypes$ = this.store.pipe(select(fromOsTypes.selectAll));
  readonly zones$ = this.store.pipe(select(fromZones.selectAll));
  readonly groups$ = this.store.pipe(select(configSelectors.get('imageGroups')));

  public snapshot: Snapshot;

  constructor(
    private store: Store<State>,
    public dialogRef: MatDialogRef<TemplateCreationContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.snapshot = data.snapshot;

    if (data.snapshot) {
      this.store.dispatch(new osTypeActions.LoadOsTypesRequest());
      this.store.dispatch(new zoneActions.LoadZonesRequest());
    }

    if (data.mode) {
      this.store.dispatch(
        new templateActions.TemplatesFilterUpdate({ selectedViewMode: data.mode }),
      );
    }
  }

  public onCreate(params: CreateTemplateBaseParams) {
    if (params.snapshotId) {
      this.store.dispatch(new templateActions.CreateTemplate(params));
    } else {
      this.store.dispatch(new templateActions.RegisterTemplate(params));
    }
  }
}
