import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  TableDatabase,
  TableDataSource
} from '../../../../../shared/components/table/table';
import { getDateSnapshotCreated, Volume } from '../../../../../shared/models';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
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
  public dataBase: TableDatabase;
  public dataSource: TableDataSource | null;
  @Input() public volume: Volume;
  @Output() public onTemplateCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onVolumeCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotRevert: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotDelete: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();

  constructor(
    public snapshotActionsService: SnapshotActionService,
  ) {
    this.dataBase = new TableDatabase();
    this.dataSource = new TableDataSource(this.dataBase);
  }

  public ngOnChanges() {
    this.dataBase.update(this.volume.snapshots);
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
