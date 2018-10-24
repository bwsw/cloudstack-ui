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
  templateUrl: 'vm-actions.component.html',
})
export class VmActionsComponent {
  @Input()
  public vm: VirtualMachine;
  @Output()
  public vmStarted = new EventEmitter<VirtualMachine>();
  @Output()
  public vmStopped = new EventEmitter<VirtualMachine>();
  @Output()
  public vmRebooted = new EventEmitter<VirtualMachine>();
  @Output()
  public vmRestored = new EventEmitter<VirtualMachine>();
  @Output()
  public vmDestroyed = new EventEmitter<VirtualMachine>();
  @Output()
  public vmResetedPassword = new EventEmitter<VirtualMachine>();
  @Output()
  public vmExpunged = new EventEmitter<VirtualMachine>();
  @Output()
  public vmRecovered = new EventEmitter<VirtualMachine>();
  @Output()
  public vmAccessed = new EventEmitter<VirtualMachine>();
  @Output()
  public vmPulse = new EventEmitter<VirtualMachine>();

  public vmActions$: Observable<any[]>;
  public destroyedVmActions: any[];

  constructor(
    store: Store<State>,
    private vmActionsService: VmActionsService,
    private authService: AuthService,
  ) {
    this.vmActions$ = store.pipe(
      select(configSelectors.get('extensions')),
      map(extensions => this.actionListDependingOnExtension(extensions.pulse)),
    );
    this.destroyedVmActions = this.vmActionsService.destroyedActions;
  }

  public onAction(action, vm: VirtualMachine): void {
    switch (action.command) {
      case VmActions.START: {
        this.vmStarted.emit(vm);
        break;
      }
      case VmActions.ACCESS: {
        this.vmAccessed.emit(vm);
        break;
      }
      case VmActions.PULSE: {
        this.vmPulse.emit(vm);
        break;
      }
      case VmActions.STOP: {
        this.vmStopped.emit(vm);
        break;
      }
      case VmActions.REBOOT: {
        this.vmRebooted.emit(vm);
        break;
      }
      case VmActions.RESTORE: {
        this.vmRestored.emit(vm);
        break;
      }
      case VmActions.RESET_PASSWORD: {
        this.vmResetedPassword.emit(vm);
        break;
      }
      case VmActions.DESTROY: {
        this.vmDestroyed.emit(vm);
        break;
      }
      case VmActions.EXPUNGE: {
        this.vmExpunged.emit(vm);
        break;
      }
      case VmActions.RECOVER: {
        this.vmRecovered.emit(vm);
        break;
      }
      default:
        break;
    }
  }

  public get vmIsDestroyed(): boolean {
    return this.vm.state === VmState.Destroyed;
  }

  public get canExpungeOrRecoverVm(): boolean {
    return this.authService.canExpungeOrRecoverVm();
  }

  private actionListDependingOnExtension(pulse: boolean) {
    return this.vmActionsService.actions.filter(action => {
      return action.command !== VmActions.PULSE || pulse;
    });
  }
}
