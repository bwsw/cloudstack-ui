import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { VmActionsService } from '../../shared/vm-actions.service';
import {
  VirtualMachine,
  VmState
} from '../../shared/vm.model';
import { VmAccessAction } from '../vm-access';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { AuthService } from '../../../shared/services/auth.service';
import { VmPulseAction } from '../vm-pulse';


@Component({
  selector: 'cs-vm-actions',
  templateUrl: 'vm-actions.component.html'
})
export class VmActionsComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onVmStart = new EventEmitter();
  @Output() public onVmStop = new EventEmitter();
  @Output() public onVmReboot = new EventEmitter();
  @Output() public onVmRestore = new EventEmitter();
  @Output() public onVmDestroy = new EventEmitter();
  @Output() public onVmResetPassword = new EventEmitter();
  @Output() public onVmExpunge = new EventEmitter();
  @Output() public onVmRecover = new EventEmitter();

  public vmActions: Array<any>;
  public destroyedVmActions: Array<any>;

  constructor(
    public accessVmAction: VmAccessAction,
    public vmPulseAction: VmPulseAction,
    private vmActionsService: VmActionsService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) {
    this.vmActions = this.vmActionsService.actions;
    this.destroyedVmActions = this.vmActionsService.destroyedActions;
  }

  public onAction(action, vm: VirtualMachine): void {
    this.dialogService.confirm({ message: action.confirmMessage })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .subscribe(() => {
        switch (action.command) {
          case 'start': {
            this.onVmStart.emit(vm);
            break;
          }
          case 'stop': {
            this.onVmStop.emit(vm);
            break;
          }
          case 'reboot': {
            this.onVmReboot.emit(vm);
            break;
          }
          case 'restore': {
            this.onVmRestore.emit(vm);
            break;
          }
          case 'resetPasswordFor': {
            this.onVmResetPassword.emit(vm);
            break;
          }
          case 'delete': {
            this.onVmDestroy.emit(vm);
            break;
          }
          case 'expunge': {
            this.onVmExpunge.emit(vm);
            break;
          }
          case 'recover': {
            this.onVmRecover.emit(vm);
            break;
          }
        }
      });
  }

  public get vmIsDestroyed(): boolean {
    return this.vm.state === VmState.Destroyed;
  }

  public get canExpungeOrRecoverVm(): boolean {
    return this.authService.canExpungeOrRecoverVm();
  }
}
