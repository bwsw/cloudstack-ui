import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { VmLog } from '../models/vm-log.model';
import { MatTableDataSource, MatRow } from '@angular/material';

@Component({
  selector: 'cs-vm-logs-table',
  templateUrl: 'vm-logs-table.component.html',
  styleUrls: ['vm-logs-table.component.scss'],
})
export class VmLogsTableComponent implements OnChanges {
  public tableColumns = ['date', 'logFile', 'text'];
  public dataSource: MatTableDataSource<VmLog>;
  @Input()
  public vmLogs: VmLog[];
  @Input()
  public enableShowMore: boolean;
  @Output()
  public showMoreClicked = new EventEmitter();
  @ViewChildren(MatRow, { read: ElementRef })
  public rows: QueryList<ElementRef>;

  constructor() {
    this.dataSource = new MatTableDataSource<VmLog>([]);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const vmLogs = changes['vmLogs'];
    if (vmLogs) {
      this.dataSource.data = vmLogs.currentValue;
    }
  }

  public onShowMore() {
    this.showMoreClicked.emit();
  }
}
