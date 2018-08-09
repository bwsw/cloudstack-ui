import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { VirtualMachine } from '../../shared/vm.model';

@Component({
  selector: 'cs-vm-reset-password',
  templateUrl: 'vm-reset-password.component.html',
  styleUrls: ['vm-reset-password.component.scss']
})
export class VmResetPasswordComponent {
  public message;
  public vm: VirtualMachine;

  constructor(
    public dialogRef: MatDialogRef<VmResetPasswordComponent>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vm = data;
    this.message = {
      translationToken: 'DIALOG_MESSAGES.VM.PASSWORD_DIALOG_MESSAGE',
      interpolateParams: {
        vmName: this.vm.name,
        vmPassword: this.vm.password,
      }
    };
  }

  public get translatedMessage(): Observable<string> {
    return this.translateService.get(
      this.message.translationToken,
      this.message.interpolateParams
    );
  }
}
