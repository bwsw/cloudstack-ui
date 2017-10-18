import {
  VirtualMachineAction,
  VmActions
} from './vm-action';
import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {
  MdDialog,
  MdDialogConfig
} from '@angular/material';
import { VmService } from '../shared/vm.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { VmAccessComponent } from './vm-actions-component/vm-access.component';


@Injectable()
export class VmAccessAction extends VirtualMachineAction {
  public action = VmActions.ACCESS;
  public name = 'VM_PAGE.COMMANDS.VM_ACCESS';
  public icon = 'computer';

  constructor (private dialog: MdDialog,
               protected dialogService: DialogService,
               protected jobsNotificationService: JobsNotificationService,
               protected vmService: VmService){
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return !!vm && vm.state === VmState.Running;
  }

  public activate(vm: VirtualMachine): Observable<void> {
    return this.dialog.open(VmAccessComponent, <MdDialogConfig>{
        width: '550px',
        data: vm
      }).afterClosed();
  }
}
