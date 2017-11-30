import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as vmActions from './vm.actions';
import {
  Action,
  Store
} from '@ngrx/store';
import { State } from '../../../reducers';
import { VmService } from '../../../vm/shared/vm.service';
import {
  VirtualMachine,
  VmState
} from '../../../vm/shared/vm.model';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { IsoService } from '../../../template/shared/iso.service';
import { MatDialog } from '@angular/material';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
import { VmResetPasswordComponent } from '../../../vm/vm-actions/vm-reset-password-component/vm-reset-password.component';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { Router } from '@angular/router';


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
  loadVMsWithDetails$: Observable<Action> = this.actions$
    .ofType(vmActions.LOAD_VMS_DETAILS_REQUEST)
    .switchMap((action: vmActions.LoadVMsDetailsRequest) => {
      return this.vmService.getListWithDetails(action.payload)
        .map((vms: VirtualMachine[]) => {
          return new vmActions.LoadVMsResponse(vms)
        })
        .catch(() => Observable.of(new vmActions.LoadVMsResponse([])));
    });


  @Effect()
  loadVM$: Observable<Action> = this.actions$
    .ofType(vmActions.LOAD_VM_REQUEST)
    .switchMap((action: vmActions.LoadVMRequest) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_IN_PROGRESS');
      return this.vmService.getList(action.payload)
        .map((vms: VirtualMachine[]) => new vmActions.UpdateVM(vms[0], {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_DONE'
        }))
        .catch((error) => Observable.of(new vmActions.VMUpdateError(error, {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_FAILED'
        })));
    });

  @Effect()
  changeDescription$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_DESCRIPTION)
    .switchMap((action: vmActions.ChangeDescription) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_IN_PROGRESS');
      return this.vmTagService
        .setDescription(action.payload.vm, action.payload.description)
        .map(vm => new vmActions.UpdateVM(vm, {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_FAILED'
          }));
        });
    });

  @Effect()
  removeDescription$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_DESCRIPTION)
    .switchMap((action: vmActions.RemoveDescription) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.REMOVE_DESCRIPTION_IN_PROGRESS');
      return this.vmTagService
        .removeDescription(action.payload.vm)
        .map(vm => new vmActions.UpdateVM(vm, {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.REMOVE_DESCRIPTION_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_DESCRIPTION_FAILED'
          }));
        });
    });

  @Effect()
  changeServiceOffering$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_SERVICE_OFFERING)
    .switchMap((action: vmActions.ChangeServiceOffering) => {
      const vmState = action.payload.vm.state;

      const change = (action) => {
        const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_IN_PROGRESS');

        return this.vmService
          .changeServiceOffering(action.payload.offering, action.payload.vm)
          .switchMap((newVm) => {
            if (vmState === VmState.Running) {
              this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(newVm), {
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE'
              }));
              return this.start(newVm);
            }
            return Observable.of(new vmActions.UpdateVM(new VirtualMachine(newVm), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE'
            }));
          })
          .catch((error: Error) => {
            return Observable.of(new vmActions.VMUpdateError(error,  {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_FAILED'
            }));
          });
      };

      if (!this.isVMStopped(action.payload.vm)) {
        return this.stop(action.payload.vm)
          .switchMap(() => change(action));
      } else {
        return change(action);
      }

    });

  @Effect()
  changeAffinityGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_AFFINITY_GROUP)
    .switchMap((action: vmActions.ChangeAffinityGroup) => {
      const vmState = action.payload.vm.state;

      const change = (action) => {
        const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_IN_PROGRESS');

        return this.affinityGroupService.updateForVm(
          action.payload.vm.id,
          action.payload.affinityGroupId
        )
          .switchMap((newVm) => {
            if (vmState === VmState.Running) {
              this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(newVm), {
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_DONE'
              }));
              return this.start(newVm);
            }
            return Observable.of(new vmActions.UpdateVM(new VirtualMachine(newVm), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_DONE'
            }));
          })
          .catch((error: Error) => {
            return Observable.of(new vmActions.VMUpdateError(error, {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_FAILED'
            }));
          });
      };

      if (!this.isVMStopped(action.payload.vm)) {
        return this.stop(action.payload.vm)
          .switchMap(() => change(action))
      } else {
        return change(action);
      }

    });

  @Effect()
  changeInstantGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_INSTANT_GROUP)
    .switchMap((action: vmActions.ChangeInstantGroup) => {
      let newVm = Object.assign(
        {},
        action.payload.vm,
        {instanceGroup: action.payload.group});
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.CHANGE_INSTANT_GROUP_IN_PROGRESS');

      return this.vmTagService.setGroup(newVm, action.payload.group)
        .map(vm => new vmActions.UpdateVM(vm, {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.CHANGE_INSTANT_GROUP_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error,  {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_INSTANT_GROUP_FAILED'
          }));
        });
    });

  @Effect()
  removeInstantGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_INSTANT_GROUP)
    .switchMap((action: vmActions.RemoveInstantGroup) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.REMOVE_INSTANT_GROUP_IN_PROGRESS');

      return this.vmTagService.removeGroup(action.payload.vm)
        .map(vm => {
          let newVm = Object.assign(
            {},
            vm,
            {instanceGroup: undefined });
          return new vmActions.UpdateVM(newVm, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_INSTANT_GROUP_DONE'
          });
        })
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error,  {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_INSTANT_GROUP_FAILED'
          }));
        });
    });

  @Effect()
  addSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_ADD_SECONDARY_IP)
    .switchMap((action: vmActions.AddSecondaryIp) => {
      return this.vmService.addIpToNic(action.payload.nicId)
        .map(res => {
          let newSecondaryIp = Object.assign([], action.payload.vm.nic[0].secondaryIp);
          newSecondaryIp.push(res.result.nicsecondaryip);
          let newNic = Object.assign({}, action.payload.vm.nic[0], { secondaryIp: newSecondaryIp });
          let newVm = Object.assign(
            {},
            action.payload.vm,
            { nic: [ newNic ] }
          );
          return new vmActions.UpdateVM(newVm,{
            message: 'JOB_NOTIFICATIONS.VM.ADD_SECONDARY_IP_DONE'
          });
        })
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            message: 'JOB_NOTIFICATIONS.VM.ADD_SECONDARY_IP_FAILED'
          }));
        });
    });

  @Effect()
  removeSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_SECONDARY_IP)
    .switchMap((action: vmActions.RemoveSecondaryIp) => {
      return this.vmService.removeIpFromNic(action.payload.id)
        .map(res => {
          let newSecondaryIp = Object.assign([], action.payload.vm.nic[0].secondaryIp)
            .filter(ip => ip.id !== action.payload.id);
          let newNic = Object.assign({}, action.payload.vm.nic[0], { secondaryIp: newSecondaryIp });
          let newVm = Object.assign(
            {},
            action.payload.vm,
            { nic: [ newNic ] }
          );
          return new vmActions.UpdateVM(newVm, {
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_DONE'
          });
        })
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_FAILED'
          }));
        });
    });

  @Effect()
  changeColor$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_COLOR)
    .switchMap((action: vmActions.ChangeVmColor) => {
      return this.vmTagService.setColor(action.payload.vm, action.payload.color)
        .map(vm => new vmActions.UpdateVM(new VirtualMachine(vm), {
          message: 'JOB_NOTIFICATIONS.VM.COLOR_CHANGE_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            message: 'JOB_NOTIFICATIONS.VM.COLOR_CHANGE_FAILED'
          }));
        });
    });

  @Effect()
  stopVm$: Observable<Action> = this.actions$
    .ofType(vmActions.STOP_VM)
    .switchMap((action: vmActions.StopVm) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.STOP_IN_PROGRESS');
      this.update(action.payload);
      return this.vmService.command(action.payload, 'stop')
        .map(vm => {
          return new vmActions.UpdateVM(new VirtualMachine(vm), {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.STOP_DONE'
          });
        })
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.STOP_FAILED'
          }));
        });
    });

  @Effect()
  startVm$: Observable<Action> = this.actions$
    .ofType(vmActions.START_VM)
    .switchMap((action: vmActions.StartVm) => {
      return this.start(action.payload);
    });

  @Effect()
  destroyVm$: Observable<Action> = this.actions$
    .ofType(vmActions.DESTROY_VM)
    .switchMap((action: vmActions.DestroyVm) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.DESTROY_IN_PROGRESS');
      this.update(action.payload.vm);
      return this.vmService.command(action.payload.vm, 'destroy', action.payload.params)
        .map(vm => {
          if (action.payload.params.expunge) {
            return new vmActions.ExpungeVmSuccess(new VirtualMachine(action.payload.vm), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE'
            });
          } else {
            return new vmActions.UpdateVM(new VirtualMachine(vm), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.DESTROY_DONE'
            });
          }
        })
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.DESTROY_FAILED'
          }));
        });
    });

  @Effect()
  rebootVm$: Observable<Action> = this.actions$
    .ofType(vmActions.REBOOT_VM)
    .switchMap((action: vmActions.RebootVm) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.REBOOT_IN_PROGRESS');
      this.update(action.payload);
      return this.vmService.command(action.payload, 'reboot')
        .map(vm => new vmActions.UpdateVM(new VirtualMachine(vm), {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.REBOOT_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.REBOOT_FAILED'
          }));
        });
    });

  @Effect()
  restoreVm$: Observable<Action> = this.actions$
    .ofType(vmActions.RESTORE_VM)
    .switchMap((action: vmActions.RestoreVm) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.RESTORE_IN_PROGRESS');
      this.update(action.payload);

      return this.vmService.command(action.payload, 'restore')
        .map(newVm => new vmActions.UpdateVM(new VirtualMachine(newVm), {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.RESTORE_DONE'
          }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.RESTORE_FAILED'
          }));
        });
    });

  @Effect()
  recoverVm$: Observable<Action> = this.actions$
    .ofType(vmActions.RECOVER_VM)
    .switchMap((action: vmActions.RecoverVm) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.RECOVER_IN_PROGRESS');
      this.update(action.payload);
      return this.vmService.commandSync(action.payload, 'recover')
        .map(vm => new vmActions.UpdateVM(new VirtualMachine(vm.virtualmachine), {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.RECOVER_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.RECOVER_FAILED'
          }));
        });
    });

  @Effect()
  expungeVm$: Observable<Action> = this.actions$
    .ofType(vmActions.EXPUNGE_VM)
    .switchMap((action: vmActions.ExpungeVm) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS');
      return this.vmService.command(action.payload, 'expunge')
        .map(vm => new vmActions.ExpungeVmSuccess(new VirtualMachine(action.payload), {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_FAILED'
          }));
        });
    });

  @Effect()
  attachIso$: Observable<Action> = this.actions$
    .ofType(vmActions.ATTACH_ISO)
    .switchMap((action: vmActions.AttachIso) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.ISO.ATTACHMENT_IN_PROGRESS');
      return this.isoService.attach(action.payload)
        .map((vm) => new vmActions.UpdateVM(new VirtualMachine(vm), {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.ISO.ATTACHMENT_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.ISO.ATTACHMENT_FAILED'
          }));
        });
    });

  @Effect()
  detachIso$: Observable<Action> = this.actions$
    .ofType(vmActions.DETACH_ISO)
    .switchMap((action: vmActions.AttachIso) => {
      const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.ISO.DETACHMENT_IN_PROGRESS');
      return this.isoService.detach(action.payload)
        .map((vm) => new vmActions.ReplaceVM(new VirtualMachine(vm), {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.ISO.DETACHMENT_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.DETACHMENT_FAILED'
          }));
        });
    });

  @Effect()
  changeSshKey$: Observable<Action> = this.actions$
    .ofType(vmActions.CHANGE_SSH_KEY)
    .switchMap((action: vmActions.ChangeSshKey) => {
      const vmState = action.payload.vm.state;

      const change = (action) => {
         const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.CHANGE_SSH_IN_PROGRESS');

        return this.sshService.reset({
          keypair: action.payload.keypair,
          id: action.payload.vm.id
        })
          .switchMap((newVm) => {
            if (vmState === VmState.Running) {
              this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(newVm), {
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.CHANGE_SSH_DONE'
              }));
              return this.start(newVm);
            }
            return Observable.of(new vmActions.UpdateVM(new VirtualMachine(newVm), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SSH_DONE'
            }));
          })
          .catch((error: Error) => {
            return Observable.of(new vmActions.VMUpdateError(error, {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SSH_FAILED'
            }));
          });
      };

      if (!this.isVMStopped(action.payload.vm)) {
        return this.stop(action.payload.vm)
          .switchMap(() => change(action))
      } else {
        return change(action);
      }
    });

  @Effect()
  resetPassword$: Observable<Action> = this.actions$
    .ofType(vmActions.RESET_PASSWORD_VM)
    .switchMap((action: vmActions.ResetPasswordVm) => {
      const vmState = action.payload.state;

      const reset = (vm) => {
        const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.RESET_PASSWORD_IN_PROGRESS');

        return this.vmService.command(vm, 'resetPasswordFor')
          .switchMap((newVm) => {
            if (vmState === VmState.Running) {
              this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(newVm), {
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_DONE'
              }));
              return this.start(newVm);
            }
            return Observable.of(new vmActions.UpdateVM(new VirtualMachine(newVm), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_DONE'
            }));
          })
          .do((action) => this.showPasswordDialog(action.payload))
          .catch((error: Error) => {
            return Observable.of(new vmActions.VMUpdateError(error, {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_FAILED'
            }));
          });
      };

      if (!this.isVMStopped(action.payload)) {
        return this.stop(action.payload)
          .switchMap(() => reset(action.payload))
      } else {
        return reset(action.payload);
      }
    });

  @Effect()
  saveNewPassword$: Observable<Action> = this.actions$
    .ofType(vmActions.SAVE_NEW_VM_PASSWORD)
    .switchMap((action: vmActions.SaveNewPassword) => {
      return this.showConfirmDialog().switchMap(() =>
        this.vmTagService.setPassword(action.payload.vm, action.payload.tag)
        .map((vm) => new vmActions.UpdateVM(new VirtualMachine(vm), {
          message: 'JOB_NOTIFICATIONS.VM.SAVE_PASSWORD_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new vmActions.VMUpdateError(error, {
            message: 'JOB_NOTIFICATIONS.VM.SAVE_PASSWORD_FAILED'
          }));
        }));
    });

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_UPDATE_ERROR)
    .do((action: vmActions.VMUpdateError) => {
      this.jobsNotificationService.fail(action.notification);
      this.handleError(action.payload);
    });

  @Effect({ dispatch: false })
  updateVm$: Observable<Action> = this.actions$
    .ofType(vmActions.UPDATE_VM, vmActions.REPLACE_VM)
    .do((action: vmActions.UpdateVM | vmActions.ReplaceVM) => {
      if (action.notification) {
        this.jobsNotificationService.finish(action.notification);
      }
    });

  @Effect({ dispatch: false })
  expungeSuccess$: Observable<VirtualMachine> = this.actions$
    .ofType(vmActions.EXPUNGE_VM_SUCCESS)
    .map((action: vmActions.ExpungeVmSuccess) => {
      this.jobsNotificationService.finish(action.notification);
      return action.payload
    })
    .filter((vm: VirtualMachine) => {
      return this.router.isActive(`/instances/${vm.id}`, false);
    })
    .do(() => {
      this.router.navigate(['./instances'], {
        queryParamsHandling: 'preserve'
      });
    });


  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private vmService: VmService,
    private vmTagService: VmTagService,
    private userTagService: UserTagService,
    private affinityGroupService: AffinityGroupService,
    private sshService: SSHKeyPairService,
    private isoService: IsoService,
    private jobsNotificationService: JobsNotificationService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private router: Router
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

  private showPasswordDialog(vm: VirtualMachine) {
    return this.dialog.open(VmResetPasswordComponent, {
      data: vm,
      width: '400px'
    });
  }

  private showConfirmDialog(): Observable<any> {
    return this.dialogService.confirm({message: 'DIALOG_MESSAGES.VM.CONFIRM_SAVE_PASSWORD'})
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          return this.userTagService.setSavePasswordForAllVms(true);
        }
        return Observable.of(null);
      });
  }

  private isVMStopped(vm: VirtualMachine): boolean {
    return vm.state === VmState.Stopped;
  }

  private start(vm) {
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.START_IN_PROGRESS');
    this.update(vm);
    return this.vmService.command(vm, 'start')
      .map((newVm) => new vmActions.UpdateVM(new VirtualMachine(
        Object.assign({}, vm, newVm)), {
        id: notificationId,
        message: 'JOB_NOTIFICATIONS.VM.START_DONE'
      }))
      .catch((error: Error) => {
        return Observable.of(new vmActions.VMUpdateError(error, {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.START_FAILED'
        }));
      });
  }

  private stop(vm) {
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.STOP_IN_PROGRESS');
    this.update(vm);
    return this.vmService.command(vm, 'stop')
      .do((newVm) => this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(newVm), {
        id: notificationId,
        message: 'JOB_NOTIFICATIONS.VM.STOP_DONE'
      })))
      .catch((error: Error) => {
        return Observable.of(new vmActions.VMUpdateError(error, {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.STOP_FAILED'
        }));
      });
  }

  private update(vm) {
    this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(Object.assign(
      {},
      vm,
      { state: VmState.InProgress }
    ))));
  }

}
