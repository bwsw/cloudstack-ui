import { Component, EventEmitter, Input, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { VmActionsService } from '../../shared/vm-actions.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { VmActions } from '../vm-action';
import { configSelectors, State } from '../../../root-store';

@Component({
  selector: 'cs-vm-actions',
  templateUrl: 'vm-actions.component.html',
})
export class VmActionsComponent {
  @Input()
  public vm: VirtualMachine;
  @Input()
  public canExpungeOrRecoverVm: boolean;
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
  @Output()
  public createVmLogsToken = new EventEmitter<VirtualMachine>();
  @Output()
  public invalidateVmLogsToken = new EventEmitter<VirtualMachine>();

  readonly vmActions$ = this.store.pipe(
    select(configSelectors.get('extensions')),
    map(extensions => {
      return this.vmActionsService.actions.filter(action => {
        if (action.command === VmActions.PULSE) {
          return extensions.pulse;
        }

        return true;
      });
    }),
  );
  readonly destroyedVmActions$ = of(this.vmActionsService.destroyedActions);
  readonly vmLogsActions$ = this.store.pipe(
    select(configSelectors.get('extensions')),
    map(extensions => {
      if (extensions.vmLogs) {
        return this.vmActionsService.vmLogsActions;
      }

      return [];
    }),
  );
  readonly showVmLogsActions$ = this.vmLogsActions$.pipe(map(actions => actions.length));

  constructor(private store: Store<State>, private vmActionsService: VmActionsService) {}

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
      case VmActions.CREATE_VM_LOGS_TOKEN: {
        this.createVmLogsToken.emit(vm);
        break;
      }
      case VmActions.INVALIDATE_VM_LOGS_TOKEN: {
        this.invalidateVmLogsToken.emit(vm);
        break;
      }
      default:
        break;
    }
  }

  public get vmIsDestroyed(): boolean {
    return this.vm.state === VmState.Destroyed;
  }
}
