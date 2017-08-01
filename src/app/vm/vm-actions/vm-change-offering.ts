import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmActionBuilderService } from './vm-action-builder.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';


export class VmChangeServiceOffering extends VirtualMachineAction {
  public action = VmActions.CHANGE_SERVICE_OFFERING;
  public name = 'CHANGE_SERVICE_OFFERING';

  constructor(
    public vm: VirtualMachine,
    protected dialogService: DialogService,
    protected vmService: VmService,
    protected vmActionBuilderService: VmActionBuilderService,
    private serviceOffering: ServiceOffering
  ) {
    super(vm, dialogService, vmService);
  }

  public canActivate(): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(this.vm.state);
  }

  public activate(): Observable<VirtualMachine> {
    if (this.serviceOffering.id === this.vm.id) {
      return Observable.of(null);
    }

    if (this.vm.state === VmStates.Stopped) {
      return this.changeServiceOfferingForStoppedVirtualMachine();
    }

    return this.changeServiceOfferingForRunningVirtualMachine();
  }

  private changeServiceOfferingForStoppedVirtualMachine(): Observable<VirtualMachine> {
    return this.vmService.changeServiceOffering(this.serviceOffering, this.vm);
  }

  private changeServiceOfferingForRunningVirtualMachine(): Observable<VirtualMachine> {
    const stop = this.vmActionBuilderService.getStopAction(this.vm);
    const start = this.vmActionBuilderService.getStartAction(this.vm);

    return this.vmService.command(stop)
      .switchMap(() => this.vmService.command(this))
      .switchMap(() => this.vmService.command(start));
  }
}
