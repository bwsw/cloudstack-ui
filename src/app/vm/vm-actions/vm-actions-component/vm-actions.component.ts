import { Component, EventEmitter, Input, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VmActionsService } from '../../shared/vm-actions.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { AuthService } from '../../../shared/services/auth.service';
import { VmActions } from '../vm-action';
import { configSelectors, State } from '../../../root-store';


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

  public vmActions$: Observable<Array<any>>;
  public destroyedVmActions: Array<any>;

  constructor(
    private vmActionsService: VmActionsService,
    private authService: AuthService,
    private store: Store<State>
  ) {
    this.vmActions$ = store.pipe(
      select(configSelectors.get('extensions')),
      map(extensions => this.actionListDependingOnExtension(extensions.pulse))
    );
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

  private actionListDependingOnExtension(pulse: boolean) {
    return this.vmActionsService.actions.filter((action) => {
      return action.command !== VmActions.PULSE || pulse;
    });
  }
}
