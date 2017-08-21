import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { VmStartActionSilent } from './silent/vm-start-silent';
import { VmStopActionSilent } from './silent/vm-stop-silent';
import { VirtualMachineAction } from './vm-action';


@Injectable()
export class VmChangeServiceOfferingAction extends VirtualMachineAction {
  public tokens = {
    progressMessage: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_FAILED'
  };

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
    protected vmStartActionSilent: VmStartActionSilent,
    protected vmStopActionSilent: VmStopActionSilent
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return [
      VmState.Running,
      VmState.Stopped
    ]
      .includes(vm.state);
  }

  public activate(vm: VirtualMachine, params: { serviceOffering: ServiceOffering }): Observable<VirtualMachine> {
    if (params.serviceOffering.id === vm.id) {
      return Observable.of(null);
    }

    if (vm.state === VmState.Stopped) {
      return this.addNotifications(
        this.changeServiceOfferingForStoppedVirtualMachine(vm, params)
      );
    }

    return this.addNotifications(
      this.changeServiceOfferingForRunningVirtualMachine(vm, params)
    );
  }

  private changeServiceOfferingForStoppedVirtualMachine(
    vm: VirtualMachine,
    params: { serviceOffering: ServiceOffering }
  ): Observable<VirtualMachine> {
    return this.vmService.changeServiceOffering(params.serviceOffering, vm);
  }

  private changeServiceOfferingForRunningVirtualMachine(
    vm: VirtualMachine,
    params: { serviceOffering: ServiceOffering }
  ): Observable<VirtualMachine> {
    const stop = this.vmStopActionSilent;
    const start = this.vmStartActionSilent;

    return this.vmService.command(vm, stop)
      .switchMap(() => this.vmService.changeServiceOffering(params.serviceOffering, vm))
      .switchMap(() => this.vmService.command(vm, start))
      .catch(error => {
        this.vmService.command(vm, start).subscribe();
        return Observable.throw(error);
      });
  }
}
