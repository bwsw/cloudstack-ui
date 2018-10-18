import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { VirtualMachine } from '../../shared/vm.model';

@Component({
  selector: 'cs-vm-reset-password',
  templateUrl: 'vm-reset-password.component.html',
  styleUrls: ['vm-reset-password.component.scss'],
})
export class VmPasswordDialogComponent {
  public message;
  public vm: VirtualMachine;

  constructor(
    public dialogRef: MatDialogRef<VmPasswordDialogComponent>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.vm = data.vm;
    const { translationToken } = data;
    this.message = {
      translationToken,
      interpolateParams: {
        vmName: this.vm.name,
      },
    };
  }

  public get translatedMessage(): Observable<string> {
    return this.translateService.get(this.message.translationToken, this.message.interpolateParams);
  }
}
