import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, onErrorResumeNext } from 'rxjs/operators';

import { State } from '../../../../../reducers';
import { Snapshot, Volume } from '../../../../../shared/models';
// tslint:disable-next-line
import { SnapshotActionService } from '../../../../../snapshot/snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';
import { DialogService } from '../../../../../dialog/dialog-service/dialog.service';

import * as snapshotActions from '../../../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-snapshots-container',
  template: `
    <cs-snapshots
      [volume]="volume"
      (templateCreated)="onTemplateCreate($event)"
      (volumeCreated)="onVolumeCreate($event)"
      (snapshotReverted)="onSnapshotRevert($event)"
      (snapshotDeleted)="onSnapshotDelete($event)"
    >
    </cs-snapshots>`,
})
export class SnapshotsContainerComponent {
  @Input()
  public volume: Volume;

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
      .pipe(
        onErrorResumeNext(),
        filter(Boolean),
      )
      .subscribe(() => {
        this.store.dispatch(new snapshotActions.DeleteSnapshot(snapshot));
      });
  }

  public onSnapshotRevert(snapshot: Snapshot): void {
    this.store.dispatch(new snapshotActions.RevertVolumeToSnapshot(snapshot));
  }
}
