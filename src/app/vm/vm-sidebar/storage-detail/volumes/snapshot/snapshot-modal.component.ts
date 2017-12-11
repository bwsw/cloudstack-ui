import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import {
  TableDatabase,
  TableDataSource
} from '../../../../../shared/components/table/table';
import { Volume } from '../../../../../shared/models';
import {
  SnapshotAction,
  SnapshotActionsService
} from '../../../../../snapshot/snapshot-actions.service';
import { Snapshot } from '../../../../../shared/models/snapshot.model';

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
  @Output() public onSnapshotDelete = new EventEmitter<Snapshot>();

  constructor(
    public snapshotActionsService: SnapshotActionsService,
  ) { }

  public ngOnChanges() {
    this.update();
  }

  public update() {
    this.dataBase = new TableDatabase(this.volume.snapshots);
    this.dataSource = new TableDataSource(this.dataBase);
  }

  public onAction(action: SnapshotAction, snapshot: Snapshot) {
    action.activate(snapshot).subscribe(
      () => {
        if (action.command === 'delete') {
          this.onSnapshotDelete.emit(snapshot);
        }
      });
  }
}
