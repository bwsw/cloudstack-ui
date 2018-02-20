import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../reducers/index';
import { Volume } from '../../../../../shared/models/volume.model';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
// tslint:disable-next-line
import { SnapshotActionService } from '../../../../../snapshot/snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';

import * as snapshotActions from '../../../../../reducers/snapshots/redux/snapshot.actions';
import { DialogService } from '../../../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-snapshots-container',
  template: `
    <cs-snapshots
      [volume]="volume"
      (onTemplateCreate)="onTemplateCreate($event)"
      (onVolumeCreate)="onVolumeCreate($event)"
      (onSnapshotRevert)="onSnapshotRevert($event)"
      (onSnapshotDelete)="onSnapshotDelete($event)"
    >
    </cs-snapshots>`,
})
export class SnapshotsContainerComponent {
  @Input() public volume: Volume;

  constructor(
    private dialogService: DialogService,
    private store: Store<State>,
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
    this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .subscribe(() => {
        this.store.dispatch(new snapshotActions.DeleteSnapshot(snapshot));
      });
  }

  public onSnapshotRevert(snapshot: Snapshot): void {
    this.store.dispatch(new snapshotActions.RevertVolumeToSnapshot(snapshot));
  }
}
