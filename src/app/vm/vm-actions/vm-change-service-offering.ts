import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { Injectable } from '@angular/core';
import { VirtualMachineAction } from './vm-action';
import { VmStartActionSilent } from './silent/vm-start-silent';
import { VmStopActionSilent } from './silent/vm-stop-silent';


@Injectable()
export class VmChangeServiceOfferingAction extends VirtualMachineAction {
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
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(vm.state);
  }

  public activate(vm: VirtualMachine, params: { serviceOffering: ServiceOffering }): Observable<VirtualMachine> {
    if (params.serviceOffering.id === vm.id) {
      return Observable.of(null);
    }

    if (vm.state === VmStates.Stopped) {
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
