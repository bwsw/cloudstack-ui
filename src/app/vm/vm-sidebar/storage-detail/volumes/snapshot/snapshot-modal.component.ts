import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';

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
export class SnapshotModalComponent implements OnInit {
  public displayedColumns = ['name', 'date', 'actions'];
  public dataBase: TableDatabase;
  public dataSource: TableDataSource | null;
  public volume: Volume;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    public dialogRef: MatDialogRef<SnapshotModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.volume = data.volume;
  }

  public ngOnInit() {
    this.update();
  }

  public update() {
    this.dataBase = new TableDatabase(this.volume.snapshots);
    this.dataSource = new TableDataSource(this.dataBase);
  }

  public onAction(action: SnapshotAction, snapshot: Snapshot) {
    action.activate(snapshot, this.volume).subscribe(
      res => {
        if (action.command === 'delete') {
          this.volume = new Volume(res);
          this.update();
        }
      });
  }

  public onClose() {
    this.dialogRef.close(this.volume);
  }
}
