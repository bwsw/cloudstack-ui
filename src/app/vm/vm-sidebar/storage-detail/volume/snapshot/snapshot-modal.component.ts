import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from '../../../../../snapshot/snapshot-actions.service';
import {
  TableDatabase,
  TableDataSource
} from '../../../../../shared/components/table/table';

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
    @Inject(MD_DIALOG_DATA) public volume: Volume
  ) {
  }

  public ngOnInit() {
    this.dataSource = new TableDataSource(this.dataBase);
  }
}
