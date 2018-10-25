import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { VirtualMachine } from '../../shared/vm.model';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';
import { State } from '../../../reducers/index';
import { HttpAccessService, SshAccessService, VncAccessService } from '../../services/index';
import { isUrl } from '../../../shared/utils/is-url';

@Component({
  selector: 'cs-vm-access-dialog',
  templateUrl: 'vm-access.component.html',
  styleUrls: ['vm-access.component.scss'],
})
export class VmAccessComponent {
  public vm: VirtualMachine;

  constructor(
    public dialogRef: MatDialogRef<VmAccessComponent>,
    public httpAccessService: HttpAccessService,
    public sshAccessService: SshAccessService,
    public vncAccessService: VncAccessService,
    private store: Store<State>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.vm = data;
  }

  public openConsoleVm(vm: VirtualMachine) {
    return this.store.dispatch(new vmActions.ConsoleVm(vm));
  }

  public openWebShell(vm: VirtualMachine) {
    return this.store.dispatch(new vmActions.WebShellVm(vm));
  }

  public openUrlVm(vm: VirtualMachine) {
    return this.store.dispatch(new vmActions.OpenUrlVm(vm));
  }

  public getVncPassword(vm: VirtualMachine): string {
    return (
      this.vncAccessService.getPassword(vm) ||
      this.translateService.instant('VM_POST_ACTION.NOT_SET')
    );
  }

  public getUrlPassword(vm: VirtualMachine): string {
    return (
      this.httpAccessService.getPassword(vm) ||
      this.translateService.instant('VM_POST_ACTION.NOT_SET')
    );
  }

  public getSshPassword(vm: VirtualMachine): string {
    return (
      this.sshAccessService.getPassword(vm) ||
      this.translateService.instant('VM_POST_ACTION.NOT_SET')
    );
  }

  public isValidUrl(url: string): boolean {
    return isUrl(url, { https: true, http: true });
  }
}
