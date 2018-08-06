import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { getDateSnapshotCreated, Snapshot, Volume } from '../../../../../shared/models';
import {
  SnapshotActions,
  SnapshotActionService
} from '../../../../../snapshot/snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html',
  styleUrls: ['snapshot-modal.component.scss']
})
export class SnapshotModalComponent implements OnChanges {
  public displayedColumns = ['name', 'date', 'actions'];
  public dataSource: MatTableDataSource<Snapshot>;
  @Input() public volume: Volume;
  @Output() public onTemplateCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onVolumeCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotRevert: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotDelete: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();

  constructor(
    public snapshotActionsService: SnapshotActionService,
  ) {
    this.dataSource = new MatTableDataSource<Snapshot>([]);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const volume = changes['volume'];
    if (volume) {
      this.dataSource.data = volume.currentValue.snapshots;
    }
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
