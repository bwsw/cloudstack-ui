import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import {
  TableDatabase,
  TableDataSource
} from '../../../../../shared/components/table/table';
import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from '../../../../../snapshot/snapshot-actions.service';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html',
  styleUrls: ['snapshot-modal.component.scss']
})
export class SnapshotModalComponent implements OnInit {
  public displayedColumns = ['name', 'date', 'actions'];
  public dataBase = new TableDatabase(this.volume.snapshots);
  public dataSource: TableDataSource | null;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    @Inject(MAT_DIALOG_DATA) public volume: Volume
  ) {
  }

  public ngOnInit() {
    this.dataSource = new TableDataSource(this.dataBase);
  }
}
