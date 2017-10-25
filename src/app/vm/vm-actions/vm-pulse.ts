import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { VmPulseComponent } from '../../pulse/vm-pulse/vm-pulse.component';
import { ConfigService } from '../../shared/services/config.service';
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
    private dialog: MatDialog,
    private configService: ConfigService
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

  public hidden(): boolean {
    const extensions = this.configService.get('extensions');
    return !(extensions && extensions.pulse);
  }
}
