import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cs-log-file-list',
  templateUrl: 'log-file-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['log-file-list.component.scss']
})
export class LogFileListComponent implements OnChanges {
  @Input() public logFiles: string[] = [];

  public dataSource: MatTableDataSource<string>;
  public tableColumns = ['logFile'];

  constructor(
    public translate: TranslateService,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<string>([]);
  }
  public ngOnChanges(changes: SimpleChanges) {
    const events = changes['logFiles'];
    if (events) {
      this.dataSource.data = events.currentValue;
    }
  }

  public goToLogs() {
    this.router.navigate(['./logs']);
  }
}
