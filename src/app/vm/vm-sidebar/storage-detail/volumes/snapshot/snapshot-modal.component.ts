import {
  Component,
  EventEmitter,
  Input,
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
export class SnapshotModalComponent {
  public displayedColumns = ['name', 'date', 'actions'];
  @Input() public dataBase: TableDatabase;
  @Input() public dataSource: TableDataSource | null;
  @Input() public volume: Volume;
  @Output() public onSnapshotDelete = new EventEmitter();

  constructor(
    public snapshotActionsService: SnapshotActionsService,
  ) { }

  public onAction(action: SnapshotAction, snapshot: Snapshot) {
    action.activate(snapshot, this.volume).subscribe(
      res => {
        if (action.command === 'delete') {
          this.onSnapshotDelete.emit(new Volume(res));
        }
      });
  }
}
