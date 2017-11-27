import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as vmActions from './vm.actions';
import { Action } from '@ngrx/store';
import { VmService } from '../../../vm/shared/vm.service';
import { VirtualMachine } from '../../../vm/shared/vm.model';

@Injectable()
export class VirtualMachinesEffects {

  @Effect()
  loadVMs$: Observable<Action> = this.actions$
    .ofType(vmActions.LOAD_VM_REQUEST)
    .switchMap((action: vmActions.LoadVMRequest) => {
      return this.vmService.getList(action.payload)
        .map((vms: VirtualMachine[]) => {
          return new vmActions.LoadVMResponse(vms);
        })
        .catch(() => Observable.of(new vmActions.LoadVMResponse([])));
    });


  constructor(
    private actions$: Actions,
    private vmService: VmService
  ) {
  }

}
