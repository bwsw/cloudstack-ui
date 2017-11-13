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
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { IsoService } from '../../../template/shared/iso.service';

@Injectable()
export class VirtualMachinesEffects {

  @Effect()
  loadVMs$: Observable<Action> = this.actions$
    .ofType(vmActions.LOAD_VMS_REQUEST)
    .switchMap((action: vmActions.LoadVMsRequest) => {
      return this.vmService.getList(action.payload)
        .map((vms: VirtualMachine[]) => new vmActions.LoadVMsResponse(vms))
        .catch(() => Observable.of(new vmActions.LoadVMsResponse([])));
    });


  @Effect()
  loadVM$: Observable<Action> = this.actions$
    .ofType(vmActions.LOAD_VM_REQUEST)
    .switchMap((action: vmActions.LoadVMRequest) => {
      return this.vmService.getList(action.payload)
        .map((vms: VirtualMachine[]) => new vmActions.UpdateVM(vms[0]))
        .catch((error) => Observable.of(new vmActions.VMUpdateError(error)));
    });

  @Effect()
  changeDescription$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_DESCRIPTION)
    .switchMap((action: vmActions.ChangeDescription) => {
      return this.vmTagService
        .setDescription(action.payload.vm, action.payload.description)
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  /*@Effect()
  stopVm$: Observable<Action> = this.actions$
    .ofType(vmActions.STOP_VM)
    .switchMap((action: vmActions.StopVM) => {
      return this.vmActionService.vmStopAction.activate(action.payload)
        .map((vm) => new vmActions.UpdateVM(new VirtualMachine(vm)))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });*/

  @Effect()
  attachIso: Observable<Action> = this.actions$
    .ofType(vmActions.ATTACH_ISO)
    .switchMap((action: vmActions.AttachIso) => {
      return this.isoService.attach(action.payload)
        .map((vm) => new vmActions.UpdateVM(new VirtualMachine(vm)))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  detachIso: Observable<Action> = this.actions$
    .ofType(vmActions.DETACH_ISO)
    .switchMap((action: vmActions.AttachIso) => {
      return this.isoService.detach(action.payload)
        .map((vm) => new vmActions.UpdateVM(new VirtualMachine(vm)))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_UPDATE_ERROR)
    .do((action: vmActions.VMUpdateError) => {
      this.handleError(action.payload);
    });


  constructor(
    private actions$: Actions,
    private vmService: VmService,
    private vmTagService: VmTagService,
    private isoService: IsoService,
    private dialogService: DialogService,
  ) {
  }

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }

}
