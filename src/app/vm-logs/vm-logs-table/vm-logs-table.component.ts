import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VmLog } from '../models/vm-log.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'cs-vm-logs-table',
  templateUrl: 'vm-logs-table.component.html',
  styleUrls: ['vm-logs-table.component.scss'],
})
export class VmLogsTableComponent implements OnChanges {
  public dataSource: MatTableDataSource<VmLog>;
  @Input()
  public vmLogs: VmLog[];

  public tableColumns = ['date', 'logFile', 'text'];

  constructor() {
    this.dataSource = new MatTableDataSource<VmLog>([]);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const vmLogs = changes['vmLogs'];
    if (vmLogs) {
      this.dataSource.data = vmLogs.currentValue;
    }
  }
}
