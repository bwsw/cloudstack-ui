import { Component } from '@angular/core';
import { filter, onErrorResumeNext } from 'rxjs/operators';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-vm-logs-secret-key',
  templateUrl: 'vm-logs-secret-key.component.html',
  styleUrls: ['vm-logs-secret-key.component.scss'],
})
export class VmLogsSecretKeyComponent {
  constructor(private dialogService: DialogService) {}

  public onRefresh(): void {
    this.dialogService.confirm({ message: 'Are you sure you want to regenerate this key?' }).pipe(
      onErrorResumeNext(),
      filter(Boolean),
    );
  }
}
