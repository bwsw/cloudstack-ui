import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { catchError, flatMap } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { map } from 'rxjs/operators/map';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { VmPulseComponent } from '../../../pulse/vm-pulse/vm-pulse.component';
// tslint:disable-next-line
import { ProgressLoggerMessageStatus } from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CSCommands } from '../../../shared/services/base-backend.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { IsoService } from '../../../template/shared/iso.service';
import { VmDestroyDialogComponent } from '../../../vm/shared/vm-destroy-dialog/vm-destroy-dialog.component';
import { getPath, getPort, getProtocol, VirtualMachine, VmResourceType, VmState } from '../../../vm/shared/vm.model';
import { VmService } from '../../../vm/shared/vm.service';
import { VmAccessComponent } from '../../../vm/vm-actions/vm-actions-component/vm-access.component';
// tslint:disable-next-line
import { VmResetPasswordComponent } from '../../../vm/vm-actions/vm-reset-password-component/vm-reset-password.component';
import { WebShellService } from '../../../vm/web-shell/web-shell.service';
import { State } from '../../index';
import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as sgActions from '../../security-groups/redux/sg.actions';
import * as vmActions from './vm.actions';
import { LoadVirtualMachine, VirtualMachineLoaded } from './vm.actions';
import { SnackBarService } from '../../../core/services';
import { of } from 'rxjs/observable/of';
import { TagService } from '../../../shared/services/tags/tag.service';
import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';


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
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.FETCH_STATISTICS_IN_PROGRESS');
      return this.vmService.getList(action.payload)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.FETCH_STATISTICS_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map((vms: VirtualMachine[]) => new vmActions.UpdateVM(vms[0]))
        .catch((error) => {
          const message = 'NOTIFICATIONS.VM.FETCH_STATISTICS_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  loadVirtualMachine$: Observable<Action> = this.actions$.pipe(
    ofType<LoadVirtualMachine>(vmActions.LOAD_VIRTUAL_MACHINE),
    map(action => action.payload),
    mergeMap(({ id }) =>
      this.vmService.getList({ id }).pipe(
        map(vms => new VirtualMachineLoaded({ vm: vms[0] }))
      )
    )
  );

  @Effect()
  changeDescription$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_DESCRIPTION)
    .mergeMap((action: vmActions.ChangeDescription) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.CHANGE_DESCRIPTION_IN_PROGRESS');
      return (action.payload.description ? this.vmTagService
        .setDescription(action.payload.vm, action.payload.description) : this.vmTagService
        .removeDescription(action.payload.vm))
        .do(() => {
          const message = 'NOTIFICATIONS.VM.CHANGE_DESCRIPTION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VM.CHANGE_DESCRIPTION_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  changeServiceOffering$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_SERVICE_OFFERING)
    .mergeMap((action: vmActions.ChangeServiceOffering) => {
      if (action.payload.vm.state === VmState.Running) {
        return this.stop(action.payload.vm).map(() => action);
      } else {
        return Observable.of(action);
      }
    })
    .switchMap(changeAction => {
      const vmState = changeAction.payload.vm.state;
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_IN_PROGRESS');

      return this.vmService
        .changeServiceOffering(changeAction.payload.offering, changeAction.payload.vm)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .switchMap((newVm) => {
          if (vmState === VmState.Running) {
            return this.start(newVm);
          } else {
            return Observable.of(new vmActions.UpdateVM(newVm));
          }
        })
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({
            vm: changeAction.payload.vm,
            state: VmState.Stopped,
            error
          }));
        });
    });

  @Effect()
  changeAffinityGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_AFFINITY_GROUP)
    .mergeMap((action: vmActions.ChangeAffinityGroup) => {
      return this.askToStopVM(
        action.payload.vm,
        'VM_PAGE.VM_DETAILS.AFFINITY_GROUP.STOP_MACHINE_FOR_AG'
      )
        .switchMap(() => {
          if (action.payload.vm.state === VmState.Running) {
            return this.stop(action.payload.vm).map(() => action);
          } else {
            return Observable.of(action);
          }
        })
        .switchMap(changeAction => {
          const vmState = changeAction.payload.vm.state;
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_IN_PROGRESS');

          return this.affinityGroupService.updateForVm(
            changeAction.payload.vm.id,
            changeAction.payload.affinityGroupId
          )
            .do(() => {
              const message = 'NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .switchMap((newVm) => {
              if (vmState === VmState.Running) {
                return this.start(newVm);
              } else {
                return Observable.of(new vmActions.UpdateVM(newVm));
              }
            })
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({
                vm: changeAction.payload.vm,
                state: VmState.Stopped,
                error
              }));
            });
        });
    });

  @Effect()
  changeInstanceGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_INSTANCE_GROUP)
    .mergeMap((action: vmActions.ChangeInstanceGroup) => {
      const newVm = Object.assign(
        {},
        action.payload.vm,
        { instanceGroup: action.payload.group }
      );
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_IN_PROGRESS');

      return this.vmTagService.setGroup(newVm, action.payload.group)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  removeInstanceGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_INSTANCE_GROUP)
    .mergeMap((action: vmActions.RemoveInstanceGroup) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_IN_PROGRESS');

      return this.vmTagService.removeGroup(action.payload)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(vm => {
          const newVm = Object.assign(
            {},
            vm,
            { instanceGroup: undefined }
          );
          return new vmActions.UpdateVM(newVm);
        })
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  addSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_ADD_SECONDARY_IP)
    .mergeMap((action: vmActions.AddSecondaryIp) => {
      return this.vmService.addIpToNic(action.payload.nicId)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.ADD_SECONDARY_IP_DONE';
          this.showNotificationsOnFinish(message);
        })
        .map(() => new LoadVirtualMachine({ id: action.payload.vm.id }))
        .catch((error: Error) => {
          this.showNotificationsOnFail(error);
          return Observable.of(null);
        });
    });

  @Effect()
  removeSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_SECONDARY_IP)
    .mergeMap((action: vmActions.RemoveSecondaryIp) => {
      return this.vmService.removeIpFromNic(action.payload.id)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_DONE';
          this.showNotificationsOnFinish(message);
        })
        .map(() => new LoadVirtualMachine({ id: action.payload.vm.id }))
        .catch((error: Error) => {
          this.showNotificationsOnFail(error);
          return Observable.of(null);
        });
    });

  @Effect()
  changeColor$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_COLOR)
    .mergeMap((action: vmActions.ChangeVmColor) => {
      return this.vmTagService.setColor(action.payload.vm, action.payload.color)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.COLOR_CHANGE_DONE';
          this.showNotificationsOnFinish(message);
        })
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          this.showNotificationsOnFail(error);
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  stopVm$: Observable<Action> = this.actions$
    .ofType(vmActions.STOP_VM)
    .mergeMap((action: vmActions.StopVm) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.STOP_IN_PROGRESS');
      this.update(action.payload, VmState.Stopping);
      return this.vmService.command(action.payload, CSCommands.Stop)
        .do(() => {
          const message = 'NOTIFICATIONS.VM.STOP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VM.STOP_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({
            vm: action.payload,
            state: VmState.Error,
            error
          }));
        });
    });

  @Effect()
  startVm$: Observable<Action> = this.actions$
    .ofType(vmActions.START_VM)
    .mergeMap((action: vmActions.StartVm) => {
      return this.start(action.payload);
    });

  @Effect()
  destroyVm$: Observable<Action> = this.actions$
    .ofType(vmActions.DESTROY_VM)
    .mergeMap((action: vmActions.DestroyVm) => {
      return this.dialog.open(VmDestroyDialogComponent, {
        data: this.authService.canExpungeOrRecoverVm()
      }).afterClosed()
        .filter(res => Boolean(res))
        .switchMap((params) => {
          const inProgressMessage = params.expunge
            ? 'NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS'
            : 'NOTIFICATIONS.VM.DESTROY_IN_PROGRESS';
          const notificationId = this.jobsNotificationService.add(inProgressMessage);
          this.update(action.payload, VmState.InProgress);

          const actions = flatMap((vm: VirtualMachine): Action[] => {
            let message: string;
            if (params.expunge) {
              message = 'NOTIFICATIONS.VM.EXPUNGE_DONE';
              this.showNotificationsOnFinish(message, notificationId);
              // workaround! Delete Private SG notification show over Expunge done notification
              setTimeout(() => {
                this.store.dispatch(new sgActions.DeletePrivateSecurityGroup(action.payload))
              }, 2000);

              return [
                new vmActions.ExpungeVmSuccess(action.payload),
                new volumeActions.DeleteVolumes({ vm: action.payload, expunged: true })
              ];
            } else {
              message = 'NOTIFICATIONS.VM.DESTROY_DONE';
              this.showNotificationsOnFinish(message, notificationId);
              return [
                new vmActions.UpdateVM(vm),
                new volumeActions.DeleteVolumes({ vm: action.payload, expunged: false })
              ];
            }
          });

          return this.vmService.command(action.payload, CSCommands.Destroy, params)
            .pipe(actions)
            .catch((error: Error) => {
              const message = params.expunge
                ? 'NOTIFICATIONS.VM.EXPUNGE_FAILED'
                : 'NOTIFICATIONS.VM.DESTROY_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({
                vm: action.payload,
                state: VmState.Error,
                error
              }));
            });
        });
    });

  @Effect()
  rebootVm$: Observable<Action> = this.actions$
    .ofType(vmActions.REBOOT_VM)
    .mergeMap((action: vmActions.RebootVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.REBOOT_IN_PROGRESS');
          this.update(action.payload, VmState.InProgress);
          return this.vmService.command(action.payload, CSCommands.Reboot)
            .do(() => {
              const message = 'NOTIFICATIONS.VM.REBOOT_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .map(vm => new vmActions.UpdateVM(vm))
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VM.REBOOT_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({
                vm: action.payload,
                state: VmState.Error,
                error
              }));
            });
        });
    });

  @Effect()
  restoreVm$: Observable<Action> = this.actions$
    .ofType(vmActions.RESTORE_VM)
    .mergeMap((action: vmActions.RestoreVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.RESTORE_IN_PROGRESS');
          this.update(action.payload, VmState.InProgress);

          return this.vmService.command(action.payload, CSCommands.Restore)
            .do(() => {
              const message = 'NOTIFICATIONS.VM.RESTORE_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .map(newVm => new vmActions.UpdateVM(newVm))
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VM.RESTORE_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({
                vm: action.payload,
                state: VmState.Error,
                error
              }));
            });
        });
    });

  @Effect()
  recoverVm$: Observable<Action> = this.actions$
    .ofType(vmActions.RECOVER_VM)
    .mergeMap((action: vmActions.RecoverVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.RECOVER_IN_PROGRESS');
          this.update(action.payload, VmState.InProgress);
          return this.vmService.commandSync(action.payload, 'recover')
            .do(() => {
              const message = 'NOTIFICATIONS.VM.RECOVER_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .map(res => new vmActions.UpdateVM(res.virtualmachine))
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VM.RECOVER_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({
                vm: action.payload,
                state: VmState.Error,
                error
              }));
            });
        });
    });

  @Effect()
  expungeVm$: Observable<Action> = this.actions$
    .ofType(vmActions.EXPUNGE_VM)
    .mergeMap((action: vmActions.ExpungeVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS');
          const actions = flatMap((): Action[] => {
            return [
              new vmActions.ExpungeVmSuccess(action.payload),
              new sgActions.DeletePrivateSecurityGroup(action.payload)
            ];
          });

          return this.vmService.command(action.payload, CSCommands.Expunge)
            .do(() => {
              const message = 'NOTIFICATIONS.VM.EXPUNGE_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .pipe(actions)
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VM.EXPUNGE_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({ error }));
            });
        });
    });

  @Effect()
  attachIso$: Observable<Action> = this.actions$
    .ofType(vmActions.ATTACH_ISO)
    .mergeMap((action: vmActions.AttachIso) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.ISO.ATTACHMENT_IN_PROGRESS');
      return this.isoService.attach(action.payload)
        .do(() => {
          const message = 'NOTIFICATIONS.ISO.ATTACHMENT_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map((vm) => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.ISO.ATTACHMENT_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  detachIso$: Observable<Action> = this.actions$
    .ofType(vmActions.DETACH_ISO)
    .mergeMap((action: vmActions.DetachIso) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.ISO.DETACHMENT_IN_PROGRESS');
      return this.isoService.detach(action.payload)
        .do(() => {
          const message = 'NOTIFICATIONS.ISO.DETACHMENT_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map((vm) => new vmActions.ReplaceVM(vm))
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VM.DETACHMENT_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  changeSshKey$: Observable<Action> = this.actions$
    .ofType(vmActions.CHANGE_SSH_KEY)
    .mergeMap((action: vmActions.ChangeSshKey) => {
      return this.askToStopVM(
        action.payload.vm,
        'VM_PAGE.VM_DETAILS.SSH_KEY.STOP_MACHINE_FOR_SSH'
      )
        .switchMap(() => {
          if (action.payload.vm.state === VmState.Running) {
            return this.stop(action.payload.vm).map(() => action);
          } else {
            return Observable.of(action);
          }
        })
        .switchMap(changeAction => {
          const vmState = changeAction.payload.vm.state;
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.CHANGE_SSH_IN_PROGRESS');

          return this.sshService.reset({
            keypair: changeAction.payload.keyPair,
            id: changeAction.payload.vm.id,
            account: changeAction.payload.vm.account,
            domainid: changeAction.payload.vm.domainid
          })
            .do(() => {
              const message = 'NOTIFICATIONS.VM.CHANGE_SSH_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .switchMap((newVm) => {
              if (vmState === VmState.Running) {
                return this.start(newVm);
              } else {
                return Observable.of(new vmActions.UpdateVM(newVm));
              }
            })
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VM.CHANGE_SSH_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({
                vm: changeAction.payload.vm,
                state: VmState.Stopped,
                error
              }));
            });
        });
    });

  @Effect()
  resetPassword$: Observable<Action> = this.actions$
    .ofType(vmActions.RESET_PASSWORD_VM)
    .mergeMap((action: vmActions.ResetPasswordVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          if (action.payload.state === VmState.Running) {
            return this.stop(action.payload).map(() => action);
          } else {
            return Observable.of(action);
          }
        })
        .switchMap(() =>  this.tagService.remove({
          resourceIds: action.payload.id,
          resourceType: VmResourceType,
          'tags[0].key': VirtualMachineTagKeys.passwordTag
        }))
        .switchMap(() => {
          const vmState = action.payload.state;
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.RESET_PASSWORD_IN_PROGRESS');
          return this.vmService.command(action.payload, CSCommands.ResetPasswordFor)
            .do(() => {
              const message = 'NOTIFICATIONS.VM.RESET_PASSWORD_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .switchMap((newVm) => {
              if (vmState === VmState.Running) {
                return this.start(newVm)
                  .do(() => this.showPasswordDialog(newVm));
              }
              this.showPasswordDialog(newVm);
              return Observable.of(new vmActions.UpdateVM(newVm));
            })
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VM.RESET_PASSWORD_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new vmActions.VMUpdateError({
                vm: action.payload,
                state: VmState.Error,
                error
              }));
            });
        });
    });

  @Effect()
  saveVMPassword$: Observable<Action> = this.actions$.pipe(
    ofType<vmActions.SaveVMPassword>(vmActions.SAVE_VM_PASSWORD),
    map(action => action.payload),
    mergeMap(({ vm, password }) => this.vmTagService.setPassword(vm, password).pipe(
      map(() => new vmActions.SaveVMPasswordSuccess({ vm, password })),
      catchError((error) => of(new vmActions.SaveVMPasswordError({ error })))
    ))
  );


  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_UPDATE_ERROR)
    .do((action: vmActions.VMUpdateError) => {
      if (action.payload.vm && action.payload.state) {
        this.update(action.payload.vm, action.payload.state);
      }
    });

  @Effect({ dispatch: false })
  expungeSuccess$: Observable<VirtualMachine> = this.actions$
    .ofType(vmActions.EXPUNGE_VM_SUCCESS)
    .map((action: vmActions.ExpungeVmSuccess) => {
      return action.payload;
    })
    .filter((vm: VirtualMachine) => {
      return this.router.isActive(`/instances/${vm.id}`, false);
    })
    .do(() => {
      this.router.navigate(['./instances'], {
        queryParamsHandling: 'preserve'
      });
    });

  @Effect()
  vmCreateSuccessLoadVolumes$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS)
    .switchMap(() => Observable.of(
      new volumeActions.LoadVolumesRequest(),
      new vmActions.DeploymentAddLoggerMessage({
        text: 'VM_PAGE.VM_CREATION.DEPLOYMENT_FINISHED',
        status: [ProgressLoggerMessageStatus.Highlighted]
      })
    ));

  @Effect({ dispatch: false })
  vmAccess$: Observable<VirtualMachine> = this.actions$
    .ofType(vmActions.ACCESS_VM)
    .map((action: vmActions.AccessVm) => action.payload)
    .do((vm: VirtualMachine) => {
      return this.dialog.open(VmAccessComponent, <MatDialogConfig>{
        width: '550px',
        data: vm
      });
    });

  @Effect({ dispatch: false })
  vmPulse$: Observable<VirtualMachine> = this.actions$
    .ofType(vmActions.PULSE_VM)
    .map((action: vmActions.PulseVm) => action.payload)
    .do((vm: VirtualMachine) => {
      return this.dialog.open(VmPulseComponent, { data: vm.id });
    });

  @Effect({ dispatch: false })
  vmWebShell$: Observable<VirtualMachine> = this.actions$
    .ofType(vmActions.WEB_SHELL_VM)
    .map((action: vmActions.WebShellVm) => action.payload)
    .do((vm: VirtualMachine) => {
      const address = WebShellService.getWebShellAddress(vm);
      window.open(
        address,
        vm.displayName,
        'resizable=0,width=820,height=640'
      );
    });

  @Effect({ dispatch: false })
  vmConsole$: Observable<VirtualMachine> = this.actions$
    .ofType(vmActions.CONSOLE_VM)
    .map((action: vmActions.ConsoleVm) => action.payload)
    .do((vm: VirtualMachine) => {
      window.open(
        `client/console?cmd=access&vm=${vm.id}`,
        vm.displayName,
        'resizable=0,width=820,height=640'
      );
    });

  @Effect({ dispatch: false })
  vmUrlAction$: Observable<VirtualMachine> = this.actions$
    .ofType(vmActions.OPEN_URL_VM)
    .map((action: vmActions.OpenUrlVm) => action.payload)
    .do((vm: VirtualMachine) => {
      const protocol = getProtocol(vm);
      const port = getPort(vm);
      const path = getPath(vm);
      const ip = vm.nic[0].ipaddress;

      const address = `${protocol}://${ip}:${port}/${path}`;
      window.open(
        address,
        vm.displayName,
        'resizable=0,width=820,height=640'
      );
    });

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private authService: AuthService,
    private vmService: VmService,
    private vmTagService: VmTagService,
    private affinityGroupService: AffinityGroupService,
    private sshService: SSHKeyPairService,
    private isoService: IsoService,
    private jobsNotificationService: JobsNotificationService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private router: Router,
    private snackBarService: SnackBarService,
    private tagService: TagService
  ) {
  }

  private showPasswordDialog(vm: VirtualMachine) {
    this.dialog.open(VmResetPasswordComponent, {
      data: vm,
      width: '400px'
    });
  }

  private isVMStopped(vm: VirtualMachine): boolean {
    return vm.state === VmState.Stopped;
  }

  private start(vm) {
    const notificationId = this.jobsNotificationService.add(
      'NOTIFICATIONS.VM.START_IN_PROGRESS');
    this.update(vm, VmState.InProgress);
    return this.vmService.command(vm, CSCommands.Start)
      .do(() => {
        const message = 'NOTIFICATIONS.VM.START_DONE';
        this.showNotificationsOnFinish(message, notificationId);
      })
      .map((newVm) => new vmActions.UpdateVM(new VirtualMachine(
        Object.assign({}, vm, newVm))))
      .catch((error: Error) => {
        const message = 'NOTIFICATIONS.VM.START_FAILED';
        this.showNotificationsOnFail(error, message, notificationId);
        return Observable.of(new vmActions.VMUpdateError({
          vm,
          state: VmState.Error,
          error
        }));
      });
  }

  public stop(vm) {
    const notificationId = this.jobsNotificationService.add(
      'NOTIFICATIONS.VM.STOP_IN_PROGRESS');
    this.update(vm, VmState.InProgress);
    return this.vmService.command(vm, CSCommands.Stop)
      .do(() => {
        const message = 'NOTIFICATIONS.VM.STOP_DONE';
        this.showNotificationsOnFinish(message, notificationId);
      })
      .switchMap((newVm) => Observable.of(newVm))
      .catch((error: Error) => {
        const message = 'NOTIFICATIONS.VM.STOP_FAILED';
        this.showNotificationsOnFail(error, message, notificationId);
        return Observable.of(new vmActions.VMUpdateError({
          vm,
          state: VmState.Error,
          error
        }));
      });
  }

  private update(vm, state: VmState) {
    this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(Object.assign(
      {},
      vm,
      { state: state }
    ))));
  }

  private askToStopVM(vm: VirtualMachine, message: string): Observable<any> {
    if (vm.state === VmState.Stopped) {
      return Observable.of(vm);
    } else {
      return this.dialogService.confirm({
        message,
        confirmText: 'COMMON.OK',
        declineText: 'COMMON.CANCEL'
      })
        .onErrorResumeNext()
        .filter(res => Boolean(res));
    }
  }

  private showNotificationsOnFinish(message: string, jobNotificationId?: string) {
    if (jobNotificationId) {
      this.jobsNotificationService.finish({
        id: jobNotificationId,
        message
      });
    }
    this.snackBarService.open(message).subscribe();
  }

  private showNotificationsOnFail(error: any, message?: string, jobNotificationId?: string) {
    if (jobNotificationId) {
      this.jobsNotificationService.fail({
        id: jobNotificationId,
        message
      });
    }
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
