import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Action, getDateSnapshotCreated, Snapshot, Volume } from '../../../../../shared/models';
import {
  SnapshotActions,
  SnapshotActionService,
} from '../../../../../snapshot/snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';
import { SnapshotModalContainerComponent } from './snapshot-modal.container';

@Component({
  selector: 'cs-snapshots',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss'],
})
export class SnapshotsComponent implements OnInit {
  @Input()
  public volume: Volume;
  @Output()
  public templateCreated: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output()
  public volumeCreated: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output()
  public snapshotReverted: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output()
  public snapshotDeleted: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  public actions: Action<Snapshot>[];
  public lastSnapshot: Snapshot;

  constructor(snapshotActionsService: SnapshotActionService, private dialog: MatDialog) {
    this.actions = snapshotActionsService.actions;
  }

  public ngOnInit() {
    if (this.volume && this.volume.snapshots) {
      this.lastSnapshot = this.volume.snapshots[0];
    }
  }

  public showSnapshots(): void {
    this.dialog
      .open(SnapshotModalContainerComponent, {
        data: { volumeId: this.volume.id },
        width: '700px',
      })
      .afterClosed();
  }

  public onAction(action, snapshot: Snapshot) {
    switch (action.command) {
      case SnapshotActions.CreateTemplate: {
        this.templateCreated.emit(snapshot);
        break;
      }
      case SnapshotActions.CreateVolume: {
        this.volumeCreated.emit(snapshot);
        break;
      }
      case SnapshotActions.Revert: {
        this.snapshotReverted.emit(snapshot);
        break;
      }
      case SnapshotActions.Delete: {
        this.snapshotDeleted.emit(snapshot);
        break;
      }
      default:
        break;
    }
  }

  public snapshotCreatedDate(snapshot: Snapshot) {
    return getDateSnapshotCreated(snapshot);
  }
}
