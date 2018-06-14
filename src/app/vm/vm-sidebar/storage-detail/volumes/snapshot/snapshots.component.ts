import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action, getDateSnapshotCreated, Snapshot, Volume } from '../../../../../shared/models';
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
export class SnapshotsComponent implements OnInit {
  @Input() public volume: Volume;
  @Output() public onTemplateCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onVolumeCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotRevert: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotDelete: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  public actions: Array<Action<Snapshot>>;
  public lastSnapshot: Snapshot;

  constructor(
    private snapshotActionsService: SnapshotActionService,
    private dialog: MatDialog,
  ) {
    this.actions = snapshotActionsService.actions;
  }

  public ngOnInit() {
    if (this.volume && this.volume.snapshots) {
      this.lastSnapshot = this.volume.snapshots[0];
    }
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
