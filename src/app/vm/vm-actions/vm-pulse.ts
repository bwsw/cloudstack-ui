import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmPulseComponent } from '../../pulse/vm-pulse/vm-pulse.component';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { VirtualMachineAction, VmActions } from './vm-action';


@Injectable()
export class VmPulseAction extends VirtualMachineAction {
  public action = VmActions.CONSOLE;
  public name = 'PULSE.PULSE';
  public icon = 'timeline';

  constructor(
    dialogService: DialogService,
    jobsNotificationService: JobsNotificationService,
    vmService: VmService,
    private dialog: MdDialog
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return true;
  }

  public activate(vm: VirtualMachine): Observable<void> {
    this.dialog.open(VmPulseComponent, { data: vm.id });

    return Observable.of(null);
  }
}
