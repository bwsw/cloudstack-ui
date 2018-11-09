import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { getDateSnapshotCreated, Snapshot, Volume } from '../../../../../shared/models';
import {
  SnapshotActions,
  SnapshotActionService,
} from '../../../../../snapshot/snapshots-page/snapshot-list-item/snapshot-actions/snapshot-action.service';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html',
  styleUrls: ['snapshot-modal.component.scss'],
})
export class SnapshotModalComponent implements OnChanges {
  public displayedColumns = ['name', 'date', 'actions'];
  public dataSource: MatTableDataSource<Snapshot>;
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

  constructor(public snapshotActionsService: SnapshotActionService) {
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
