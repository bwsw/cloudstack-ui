import { Component, Input } from '@angular/core';
import { State } from '../../../../reducers';
import { Snapshot } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import { SnapshotActionService } from './snapshot-action.service';

import * as snapshotActions from '../../../../reducers/snapshots/redux/snapshot.actions';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-snapshot-action-container',
  template: `
    <cs-snapshot-action
      [snapshot]="snapshot"
      (templateCreated)="onTemplateCreate($event)"
      (volumeCreated)="onVolumeCreate($event)"
      (snapshotDeleted)="onSnapshotDelete($event)"
      (snapshotReverted)="onSnapshotRevert($event)"
    >
    </cs-snapshot-action>`,
})
export class SnapshotActionContainerComponent {
  @Input()
  public snapshot: Snapshot;

  constructor(
    private dialogService: DialogService,
    private store: Store<State>,
    private snapshotActionService: SnapshotActionService,
  ) {}

  public onTemplateCreate(snapshot: Snapshot) {
    this.snapshotActionService.showTemplateCreationDialog(snapshot);
  }

  public onVolumeCreate(snapshot: Snapshot) {
    this.snapshotActionService.showVolumeCreationDialog(snapshot);
  }

  public onSnapshotDelete(snapshot: Snapshot): void {
    this.dialogService
      .confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new snapshotActions.DeleteSnapshot(snapshot));
        }
      });
  }

  public onSnapshotRevert(snapshot: Snapshot): void {
    this.store.dispatch(new snapshotActions.RevertVolumeToSnapshot(snapshot));
  }
}
