import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { getDateSnapshotCreated, Volume } from '../../../../../shared/models';
import { Action } from '../../../../../shared/models/action.model';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
import {
  SnapshotActions,
  SnapshotActionService
} from '../../../../../snapshot/snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';
import { SnapshotModalContainerComponent } from './snapshot-modal.container';


@Component({
  selector: 'cs-snapshots',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss']
})
export class SnapshotsComponent {
  @Input() public volume: Volume;
  @Output() public onTemplateCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onVolumeCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotRevert: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotDelete: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  public actions: Array<Action<Snapshot>>;

  constructor(
    public snapshotActionsService: SnapshotActionService,
    private dialog: MatDialog,
  ) {
    this.actions = snapshotActionsService.actions;
  }

  public showSnapshots(): void {
    this.dialog.open(SnapshotModalContainerComponent, {
      data: { volumeId: this.volume.id },
      width: '700px'
    }).afterClosed();
  }

  public onAction(action, snapshot: Snapshot) {
    switch (action.command) {
      case SnapshotActions.CreateTemplate: {
        this.onTemplateCreate.emit(snapshot);
        break;
      }
      case SnapshotActions.CreateVolume: {
        this.onVolumeCreate.emit(snapshot);
        break;
      }
      case SnapshotActions.Revert: {
        this.onSnapshotRevert.emit(snapshot);
        break;
      }
      case SnapshotActions.Delete: {
        this.onSnapshotDelete.emit(snapshot);
        break;
      }
    }
  }

  public snapshotCreatedDate(snapshot: Snapshot) {
    return getDateSnapshotCreated(snapshot);
  }
}
