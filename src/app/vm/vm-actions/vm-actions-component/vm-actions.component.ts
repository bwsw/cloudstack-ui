import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigService } from '../../../core/services';
import { VmActionsService } from '../../shared/vm-actions.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { AuthService } from '../../../shared/services/auth.service';
import { VmActions } from '../vm-action';


@Component({
  selector: 'cs-vm-actions',
  templateUrl: 'vm-actions.component.html'
})
export class VmActionsComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onVmStart = new EventEmitter<VirtualMachine>();
  @Output() public onVmStop = new EventEmitter<VirtualMachine>();
  @Output() public onVmReboot = new EventEmitter<VirtualMachine>();
  @Output() public onVmRestore = new EventEmitter<VirtualMachine>();
  @Output() public onVmDestroy = new EventEmitter<VirtualMachine>();
  @Output() public onVmResetPassword = new EventEmitter<VirtualMachine>();
  @Output() public onVmExpunge = new EventEmitter<VirtualMachine>();
  @Output() public onVmRecover = new EventEmitter<VirtualMachine>();
  @Output() public onVmAccess = new EventEmitter<VirtualMachine>();
  @Output() public onVmPulse = new EventEmitter<VirtualMachine>();

  public vmActions: Array<any>;
  public destroyedVmActions: Array<any>;

  constructor(
    private configService: ConfigService,
    private vmActionsService: VmActionsService,
    private authService: AuthService,
  ) {
    this.vmActions = this.vmActionsService.actions.filter((action) => {
      const extensions = this.configService.get('extensions');
      return action.command !== VmActions.PULSE || extensions && extensions.pulse;
    });
    this.destroyedVmActions = this.vmActionsService.destroyedActions;
  }

  public onAction(action, vm: VirtualMachine): void {
    switch (action.command) {
      case VmActions.START: {
        this.onVmStart.emit(vm);
        break;
      }
      case VmActions.ACCESS: {
        this.onVmAccess.emit(vm);
        break;
      }
      case VmActions.PULSE: {
        this.onVmPulse.emit(vm);
        break;
      }
      case VmActions.STOP: {
        this.onVmStop.emit(vm);
        break;
      }
      case VmActions.REBOOT: {
        this.onVmReboot.emit(vm);
        break;
      }
      case VmActions.RESTORE: {
        this.onVmRestore.emit(vm);
        break;
      }
      case VmActions.RESET_PASSWORD: {
        this.onVmResetPassword.emit(vm);
        break;
      }
      case VmActions.DESTROY: {
        this.onVmDestroy.emit(vm);
        break;
      }
      case VmActions.EXPUNGE: {
        this.onVmExpunge.emit(vm);
        break;
      }
      case VmActions.RECOVER: {
        this.onVmRecover.emit(vm);
        break;
      }
    }
  }

  public get vmIsDestroyed(): boolean {
    return this.vm.state === VmState.Destroyed;
  }

  public get canExpungeOrRecoverVm(): boolean {
    return this.authService.canExpungeOrRecoverVm();
  }
}
