import { Component, OnInit } from '@angular/core';
import { ApiLogService } from '../../../shared/services/api-log.service';
import { SnackBarService } from '../../../core/services';

@Component({
  selector: 'cs-vm-api-log',
  templateUrl: 'vm-api-log.component.html',
  styleUrls: ['vm-api-log.component.scss'],
})
export class VmApiLogComponent implements OnInit {
  constructor(private apiLogService: ApiLogService, private notificationService: SnackBarService) {}

  public ngOnInit() {}

  public get apiLog() {
    return this.apiLogService.apiLog;
  }

  public onCopySuccess(): void {
    this.notificationService.open('CLIPBOARD.COPY_SUCCESS').subscribe();
  }

  public onCopyFail(): void {
    this.notificationService.open('CLIPBOARD.COPY_FAIL').subscribe();
  }
}
