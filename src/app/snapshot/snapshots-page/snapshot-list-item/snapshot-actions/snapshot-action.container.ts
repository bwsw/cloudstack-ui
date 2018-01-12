import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { State } from '../../../../reducers';
import { Snapshot } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import { SnapshotActionService } from './snapshot-action.service';

import * as snapshotActions from '../../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-snapshot-action-container',
  template: `
    <cs-snapshot-action
      [snapshot]="snapshot"
      (onTemplateCreate)="onTemplateCreate($event)"
      (onVolumeCreate)="onVolumeCreate($event)"
      (onSnapshotDelete)="onSnapshotDelete($event)"
      (onSnapshotRevert)="onSnapshotRevert($event)"
    >
    </cs-snapshot-action>`,
})
export class SnapshotActionContainerComponent {
  @Input() public snapshot: Snapshot;

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private snapshotActionService: SnapshotActionService
  ) {
  }

  public onTemplateCreate(snapshot: Snapshot) {
    this.snapshotActionService.showTemplateCreationDialog(snapshot);
  }

  public onVolumeCreate(snapshot: Snapshot) {
    this.snapshotActionService.showVolumeCreationDialog(snapshot);
  }

  public onSnapshotDelete(snapshot: Snapshot): void {
    this.store.dispatch(new snapshotActions.DeleteSnapshot(snapshot));
  }

  public onSnapshotRevert(snapshot: Snapshot): void {
    this.store.dispatch(new snapshotActions.RevertVolumeToSnapshot(snapshot));
  }
}
