import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { VmActionsService } from '../shared/vm-actions.service';


export class VmChangeServiceOfferingAction extends VirtualMachineAction {
  public action = VmActions.CHANGE_SERVICE_OFFERING;
  public name = 'CHANGE_SERVICE_OFFERING';

  constructor(
    public serviceOffering: ServiceOffering,
    protected dialogService: DialogService,
    protected vmService: VmService,
    protected vmActionsService: VmActionsService,
  ) {
    super(dialogService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(vm.state);
  }

  public activate(vm: VirtualMachine): Observable<VirtualMachine> {
    if (this.serviceOffering.id === vm.id) {
      return Observable.of(null);
    }

    if (vm.state === VmStates.Stopped) {
      return this.changeServiceOfferingForStoppedVirtualMachine(vm);
    }

    return this.changeServiceOfferingForRunningVirtualMachine(vm);
  }

  private changeServiceOfferingForStoppedVirtualMachine(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.vmService.changeServiceOffering(this.serviceOffering, vm);
  }

  private changeServiceOfferingForRunningVirtualMachine(vm: VirtualMachine): Observable<VirtualMachine> {
    const stop = this.vmActionsService.getStopAction();
    const start = this.vmActionsService.getStartAction();

    return this.vmService.command(vm, stop)
      .switchMap(() => this.vmService.command(vm, this))
      .switchMap(() => this.vmService.command(vm, start));
  }
}
