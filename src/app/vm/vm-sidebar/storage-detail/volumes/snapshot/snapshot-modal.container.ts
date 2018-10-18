import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { filter, onErrorResumeNext, takeUntil } from 'rxjs/operators';

import { State } from '../../../../../reducers/index';
import { Volume } from '../../../../../shared/models/volume.model';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
// tslint:disable-next-line
import { SnapshotActionService } from '../../../../../snapshot/snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';
import { WithUnsubscribe } from '../../../../../utils/mixins/with-unsubscribe';

import * as volumeActions from '../../../../../reducers/volumes/redux/volumes.actions';
import * as snapshotActions from '../../../../../reducers/snapshots/redux/snapshot.actions';
import * as fromVolumes from '../../../../../reducers/volumes/redux/volumes.reducers';
import { DialogService } from '../../../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-snapshot-modal-container',
  template: `
    <cs-snapshot-modal
      [volume]="volume$ | async"
      (templateCreated)="onTemplateCreate($event)"
      (volumeCreated)="onVolumeCreate($event)"
      (snapshotReverted)="onSnapshotRevert($event)"
      (snapshotDeleted)="onSnapshotDelete($event)"
    >
    </cs-snapshot-modal>`,
})
export class SnapshotModalContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly volume$ = this.store.pipe(select(fromVolumes.getSelectedVolumeWithSnapshots));

  public volume: Volume;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<SnapshotModalContainerComponent>,
    private store: Store<State>,
    private dialogService: DialogService,
    private snapshotActionService: SnapshotActionService,
  ) {
    super();
    this.store.dispatch(new volumeActions.LoadSelectedVolume(data.volumeId));
  }

  public ngOnInit() {
    this.volume$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(volume => !!volume),
      )
      .subscribe(volume => {
        // todo remove model
        this.volume = volume as Volume;
        if (!this.volume.snapshots || !this.volume.snapshots.length) {
          this.dialogRef.close();
        }
      });
  }

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
