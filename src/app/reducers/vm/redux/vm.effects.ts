import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  flatMap,
  map,
  mergeMap,
  onErrorResumeNext,
  switchMap,
  tap,
} from 'rxjs/operators';

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
import { VirtualMachine, vmResourceType, VmState } from '../../../vm/shared/vm.model';
import { VmService } from '../../../vm/shared/vm.service';
import { VmAccessComponent } from '../../../vm/vm-actions/vm-actions-component/vm-access.component';
// tslint:disable-next-line
import { VmPasswordDialogComponent } from '../../../vm/vm-actions/vm-reset-password-component/vm-password-dialog.component';
import { State } from '../../index';
import * as vmActions from './vm.actions';
import { SnackBarService } from '../../../core/services';
import { TagService } from '../../../shared/services/tags/tag.service';
import { virtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';
import { HttpAccessService, SshAccessService, VncAccessService } from '../../../vm/services';

import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as sgActions from '../../security-groups/redux/sg.actions';

@Injectable()
export class VirtualMachinesEffects {
  @Effect()
  loadVMs$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.LOAD_VMS_REQUEST),
    switchMap((action: vmActions.LoadVMsRequest) => {
      return this.vmService.getList(action.payload).pipe(
        map((vms: VirtualMachine[]) => new vmActions.LoadVMsResponse(vms)),
        catchError(() => of(new vmActions.LoadVMsResponse([]))),
      );
    }),
  );

  @Effect()
  loadVM$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.LOAD_VM_REQUEST),
    switchMap((action: vmActions.LoadVMRequest) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.FETCH_STATISTICS_IN_PROGRESS',
      );
      return this.vmService.getList(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.FETCH_STATISTICS_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map((vms: VirtualMachine[]) => new vmActions.UpdateVM(vms[0])),
        catchError(error => {
          const message = 'NOTIFICATIONS.VM.FETCH_STATISTICS_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new vmActions.VMUpdateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  loadVirtualMachine$: Observable<Action> = this.actions$.pipe(
    ofType<vmActions.LoadVirtualMachine>(vmActions.LOAD_VIRTUAL_MACHINE),
    map(action => action.payload),
    mergeMap(({ id }) =>
      this.vmService
        .getList({ id })
        .pipe(map(vms => new vmActions.VirtualMachineLoaded({ vm: vms[0] }))),
    ),
  );

  @Effect()
  changeDescription$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_CHANGE_DESCRIPTION),
    mergeMap((action: vmActions.ChangeDescription) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.CHANGE_DESCRIPTION_IN_PROGRESS',
      );
      return (action.payload.description
        ? this.vmTagService.setDescription(action.payload.vm, action.payload.description)
        : this.vmTagService.removeDescription(action.payload.vm)
      ).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.CHANGE_DESCRIPTION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vm => new vmActions.UpdateVM(vm)),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.VM.CHANGE_DESCRIPTION_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new vmActions.VMUpdateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  changeServiceOffering$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_CHANGE_SERVICE_OFFERING),
    mergeMap((action: vmActions.ChangeServiceOffering) => {
      if (action.payload.vm.state === VmState.Running) {
        return this.stop(action.payload.vm).pipe(map(() => action));
      }
      return of(action);
    }),
    switchMap(changeAction => {
      const vmState = changeAction.payload.vm.state;
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_IN_PROGRESS',
      );

      return this.vmService
        .changeServiceOffering(changeAction.payload.offering, changeAction.payload.vm)
        .pipe(
          tap(() => {
            const message = 'NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE';
            this.showNotificationsOnFinish(message, notificationId);
          }),
          switchMap(newVm => {
            if (vmState === VmState.Running) {
              return this.start(newVm);
            }
            return of(new vmActions.UpdateVM(newVm));
          }),
          catchError((error: Error) => {
            const message = 'NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_FAILED';
            this.dialogService.showNotificationsOnFail(error, message, notificationId);
            return of(
              new vmActions.VMUpdateError({
                error,
                vm: changeAction.payload.vm,
                state: VmState.Stopped,
              }),
            );
          }),
        );
    }),
  );

  @Effect()
  changeAffinityGroup$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_CHANGE_AFFINITY_GROUP),
    mergeMap((action: vmActions.ChangeAffinityGroup) => {
      return this.askToStopVM(
        action.payload.vm,
        'VM_PAGE.VM_DETAILS.AFFINITY_GROUP.STOP_MACHINE_FOR_AG',
      ).pipe(
        switchMap(() => {
          if (action.payload.vm.state === VmState.Running) {
            return this.stop(action.payload.vm).pipe(map(() => action));
          }
          return of(action);
        }),
        switchMap(changeAction => {
          const vmState = changeAction.payload.vm.state;
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_IN_PROGRESS',
          );

          return this.affinityGroupService
            .updateForVm(changeAction.payload.vm.id, changeAction.payload.affinityGroupIds)
            .pipe(
              tap(() => {
                const message = 'NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_DONE';
                this.showNotificationsOnFinish(message, notificationId);
              }),
              switchMap(newVm => {
                if (vmState === VmState.Running) {
                  return this.start(newVm);
                }
                return of(new vmActions.UpdateVM(newVm));
              }),
              catchError((error: Error) => {
                const message = 'NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_FAILED';
                this.dialogService.showNotificationsOnFail(error, message, notificationId);
                return of(
                  new vmActions.VMUpdateError({
                    error,
                    vm: changeAction.payload.vm,
                    state: VmState.Stopped,
                  }),
                );
              }),
            );
        }),
      );
    }),
  );

  @Effect()
  changeInstanceGroup$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_CHANGE_INSTANCE_GROUP),
    mergeMap((action: vmActions.ChangeInstanceGroup) => {
      const newVm: VirtualMachine = { ...action.payload.vm };
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_IN_PROGRESS',
      );

      return this.vmTagService.setGroup(newVm, action.payload.group).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vm => new vmActions.UpdateVM(vm)),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new vmActions.VMUpdateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  removeInstanceGroup$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_REMOVE_INSTANCE_GROUP),
    mergeMap((action: vmActions.RemoveInstanceGroup) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_IN_PROGRESS',
      );

      return this.vmTagService.removeGroup(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vm => {
          const newVm: VirtualMachine = { ...vm };
          return new vmActions.UpdateVM(newVm);
        }),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new vmActions.VMUpdateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  addSecondaryIp$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_ADD_SECONDARY_IP),
    mergeMap((action: vmActions.AddSecondaryIp) => {
      return this.vmService.addIpToNic(action.payload.nicId).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.ADD_SECONDARY_IP_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(() => new vmActions.LoadVirtualMachine({ id: action.payload.vm.id })),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(null);
        }),
      );
    }),
  );

  @Effect()
  removeSecondaryIp$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_REMOVE_SECONDARY_IP),
    mergeMap((action: vmActions.RemoveSecondaryIp) => {
      return this.vmService.removeIpFromNic(action.payload.id).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(() => new vmActions.LoadVirtualMachine({ id: action.payload.vm.id })),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(null);
        }),
      );
    }),
  );

  @Effect()
  changeColor$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_CHANGE_COLOR),
    mergeMap((action: vmActions.ChangeVmColor) => {
      return this.vmTagService.setColor(action.payload.vm, action.payload.color).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.COLOR_CHANGE_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(vm => new vmActions.UpdateVM(vm)),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new vmActions.VMUpdateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  stopVm$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.STOP_VM),
    mergeMap((action: vmActions.StopVm) => {
      const notificationId = this.jobsNotificationService.add('NOTIFICATIONS.VM.STOP_IN_PROGRESS');
      this.update(action.payload, VmState.Stopping);
      return this.vmService.command(action.payload, CSCommands.Stop).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM.STOP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vm => new vmActions.UpdateVM(vm)),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.VM.STOP_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(
            new vmActions.VMUpdateError({
              error,
              vm: action.payload,
              state: VmState.Error,
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  startVm$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.START_VM),
    mergeMap((action: vmActions.StartVm) => {
      return this.start(action.payload);
    }),
  );

  @Effect()
  destroyVm$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.DESTROY_VM),
    mergeMap((action: vmActions.DestroyVm) => {
      return this.dialog
        .open(VmDestroyDialogComponent, {
          data: this.authService.canExpungeOrRecoverVm(),
        })
        .afterClosed()
        .pipe(
          filter(Boolean),
          switchMap(params => {
            const inProgressMessage = params.expunge
              ? 'NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS'
              : 'NOTIFICATIONS.VM.DESTROY_IN_PROGRESS';
            const notificationId = this.jobsNotificationService.add(inProgressMessage);
            this.update(action.payload, VmState.InProgress);

            const actions = flatMap(
              (vm: VirtualMachine): Action[] => {
                let message: string;
                if (params.expunge) {
                  message = 'NOTIFICATIONS.VM.EXPUNGE_DONE';
                  this.showNotificationsOnFinish(message, notificationId);
                  // workaround! Delete Private SG notification show over Expunge done notification
                  setTimeout(() => {
                    this.store.dispatch(new sgActions.DeletePrivateSecurityGroup(action.payload));
                  }, 2000);

                  return [
                    new vmActions.ExpungeVmSuccess(action.payload),
                    new volumeActions.DeleteVolumes({ vm: action.payload, expunged: true }),
                  ];
                }
                message = 'NOTIFICATIONS.VM.DESTROY_DONE';
                this.showNotificationsOnFinish(message, notificationId);
                return [
                  new vmActions.UpdateVM(vm),
                  new volumeActions.DeleteVolumes({ vm: action.payload, expunged: false }),
                ];
              },
            );

            return this.vmService
              .command(action.payload, CSCommands.Destroy, params)
              .pipe(actions)
              .pipe(
                catchError((error: Error) => {
                  const message = params.expunge
                    ? 'NOTIFICATIONS.VM.EXPUNGE_FAILED'
                    : 'NOTIFICATIONS.VM.DESTROY_FAILED';
                  this.dialogService.showNotificationsOnFail(error, message, notificationId);
                  return of(
                    new vmActions.VMUpdateError({
                      error,
                      vm: action.payload,
                      state: VmState.Error,
                    }),
                  );
                }),
              );
          }),
        );
    }),
  );

  @Effect()
  rebootVm$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.REBOOT_VM),
    mergeMap((action: vmActions.RebootVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT' }).pipe(
        onErrorResumeNext(),
        filter(Boolean),
        switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.REBOOT_IN_PROGRESS',
          );
          this.update(action.payload, VmState.InProgress);
          return this.vmService.command(action.payload, CSCommands.Reboot).pipe(
            tap(() => {
              const message = 'NOTIFICATIONS.VM.REBOOT_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            }),
            map(vm => new vmActions.UpdateVM(vm)),
            catchError((error: Error) => {
              const message = 'NOTIFICATIONS.VM.REBOOT_FAILED';
              this.dialogService.showNotificationsOnFail(error, message, notificationId);
              return of(
                new vmActions.VMUpdateError({
                  error,
                  vm: action.payload,
                  state: VmState.Error,
                }),
              );
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  restoreVm$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.RESTORE_VM),
    mergeMap((action: vmActions.RestoreVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE' }).pipe(
        onErrorResumeNext(),
        filter(Boolean),
        switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.RESTORE_IN_PROGRESS',
          );
          this.update(action.payload, VmState.InProgress);

          return this.vmService.command(action.payload, CSCommands.Restore).pipe(
            tap(() => {
              const message = 'NOTIFICATIONS.VM.RESTORE_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            }),
            map(newVm => new vmActions.UpdateVM(newVm)),
            catchError((error: Error) => {
              const message = 'NOTIFICATIONS.VM.RESTORE_FAILED';
              this.dialogService.showNotificationsOnFail(error, message, notificationId);
              return of(
                new vmActions.VMUpdateError({
                  error,
                  vm: action.payload,
                  state: VmState.Error,
                }),
              );
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  recoverVm$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.RECOVER_VM),
    mergeMap((action: vmActions.RecoverVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER' }).pipe(
        onErrorResumeNext(),
        filter(Boolean),
        switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.RECOVER_IN_PROGRESS',
          );
          this.update(action.payload, VmState.InProgress);
          return this.vmService.commandSync(action.payload, 'recover').pipe(
            tap(() => {
              const message = 'NOTIFICATIONS.VM.RECOVER_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            }),
            map(res => new vmActions.UpdateVM(res.virtualmachine)),
            catchError((error: Error) => {
              const message = 'NOTIFICATIONS.VM.RECOVER_FAILED';
              this.dialogService.showNotificationsOnFail(error, message, notificationId);
              return of(
                new vmActions.VMUpdateError({
                  error,
                  vm: action.payload,
                  state: VmState.Error,
                }),
              );
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  expungeVm$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.EXPUNGE_VM),
    mergeMap((action: vmActions.ExpungeVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE' }).pipe(
        onErrorResumeNext(),
        filter(Boolean),
        switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS',
          );
          const actions = flatMap(
            (): Action[] => {
              return [
                new vmActions.ExpungeVmSuccess(action.payload),
                new sgActions.DeletePrivateSecurityGroup(action.payload),
              ];
            },
          );

          return this.vmService
            .command(action.payload, CSCommands.Expunge)
            .pipe(
              tap(() => {
                const message = 'NOTIFICATIONS.VM.EXPUNGE_DONE';
                this.showNotificationsOnFinish(message, notificationId);
              }),
            )
            .pipe(actions)
            .pipe(
              catchError((error: Error) => {
                const message = 'NOTIFICATIONS.VM.EXPUNGE_FAILED';
                this.dialogService.showNotificationsOnFail(error, message, notificationId);
                return of(new vmActions.VMUpdateError({ error }));
              }),
            );
        }),
      );
    }),
  );

  @Effect()
  attachIso$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.ATTACH_ISO),
    mergeMap((action: vmActions.AttachIso) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.ISO.ATTACHMENT_IN_PROGRESS',
      );
      return this.isoService.attach(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ISO.ATTACHMENT_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vm => new vmActions.UpdateVM(vm)),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.ISO.ATTACHMENT_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new vmActions.VMUpdateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  detachIso$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.DETACH_ISO),
    mergeMap((action: vmActions.DetachIso) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.ISO.DETACHMENT_IN_PROGRESS',
      );
      return this.isoService.detach(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ISO.DETACHMENT_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vm => new vmActions.ReplaceVM(vm)),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.VM.DETACHMENT_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new vmActions.VMUpdateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  changeSshKey$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.CHANGE_SSH_KEY),
    mergeMap((action: vmActions.ChangeSshKey) => {
      return this.askToStopVM(
        action.payload.vm,
        'VM_PAGE.VM_DETAILS.SSH_KEY.STOP_MACHINE_FOR_SSH',
      ).pipe(
        switchMap(() => {
          if (action.payload.vm.state === VmState.Running) {
            return this.stop(action.payload.vm).pipe(map(() => action));
          }
          return of(action);
        }),
        switchMap(changeAction => {
          const vmState = changeAction.payload.vm.state;
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VM.CHANGE_SSH_IN_PROGRESS',
          );

          return this.sshService
            .reset({
              keypair: changeAction.payload.keyPair,
              id: changeAction.payload.vm.id,
              account: changeAction.payload.vm.account,
              domainid: changeAction.payload.vm.domainid,
            })
            .pipe(
              tap(() => {
                const message = 'NOTIFICATIONS.VM.CHANGE_SSH_DONE';
                this.showNotificationsOnFinish(message, notificationId);
              }),
              switchMap(newVm => {
                if (vmState === VmState.Running) {
                  return this.start(newVm);
                }
                return of(new vmActions.UpdateVM(newVm));
              }),
              catchError((error: Error) => {
                const message = 'NOTIFICATIONS.VM.CHANGE_SSH_FAILED';
                this.dialogService.showNotificationsOnFail(error, message, notificationId);
                return of(
                  new vmActions.VMUpdateError({
                    error,
                    vm: changeAction.payload.vm,
                    state: VmState.Stopped,
                  }),
                );
              }),
            );
        }),
      );
    }),
  );

  @Effect()
  resetPassword$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.RESET_PASSWORD_VM),
    mergeMap((action: vmActions.ResetPasswordVm) => {
      return this.dialogService
        .confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD' })
        .pipe(
          onErrorResumeNext(),
          filter(Boolean),
          switchMap(() => {
            if (action.payload.state === VmState.Running) {
              return this.stop(action.payload).pipe(map(() => action));
            }
            return of(action);
          }),
          switchMap(() =>
            this.tagService.remove({
              resourceIds: action.payload.id,
              resourceType: vmResourceType,
              'tags[0].key': virtualMachineTagKeys.passwordTag,
            }),
          ),
          switchMap(() => {
            const vmState = action.payload.state;
            const notificationId = this.jobsNotificationService.add(
              'NOTIFICATIONS.VM.RESET_PASSWORD_IN_PROGRESS',
            );
            return this.vmService.command(action.payload, CSCommands.ResetPasswordFor).pipe(
              tap(() => {
                const message = 'NOTIFICATIONS.VM.RESET_PASSWORD_DONE';
                this.showNotificationsOnFinish(message, notificationId);
              }),
              switchMap(newVm => {
                if (vmState === VmState.Running) {
                  return this.start(newVm).pipe(
                    tap(() =>
                      this.showPasswordDialog(newVm, 'VM_PASSWORD.PASSWORD_HAS_BEEN_RESET'),
                    ),
                  );
                }
                this.showPasswordDialog(newVm, 'VM_PASSWORD.PASSWORD_HAS_BEEN_RESET');
                return of(new vmActions.UpdateVM(newVm));
              }),
              catchError((error: Error) => {
                const message = 'NOTIFICATIONS.VM.RESET_PASSWORD_FAILED';
                this.dialogService.showNotificationsOnFail(error, message, notificationId);
                return of(
                  new vmActions.VMUpdateError({
                    error,
                    vm: action.payload,
                    state: VmState.Error,
                  }),
                );
              }),
            );
          }),
        );
    }),
  );

  @Effect()
  saveVMPassword$: Observable<Action> = this.actions$.pipe(
    ofType<vmActions.SaveVMPassword>(vmActions.SAVE_VM_PASSWORD),
    map(action => action.payload),
    mergeMap(({ vm, password }) =>
      this.vmTagService.setPassword(vm, password).pipe(
        map(() => new vmActions.SaveVMPasswordSuccess({ password, vmId: vm.id })),
        catchError(error => of(new vmActions.SaveVMPasswordError({ error }))),
      ),
    ),
  );

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_UPDATE_ERROR),
    tap((action: vmActions.VMUpdateError) => {
      if (action.payload.vm && action.payload.state) {
        this.update(action.payload.vm, action.payload.state);
      }
    }),
  );

  @Effect({ dispatch: false })
  expungeSuccess$: Observable<VirtualMachine> = this.actions$.pipe(
    ofType(vmActions.EXPUNGE_VM_SUCCESS),
    map((action: vmActions.ExpungeVmSuccess) => {
      return action.payload;
    }),
    filter((vm: VirtualMachine) => {
      return this.router.isActive(`/instances/${vm.id}`, false);
    }),
    tap(() => {
      this.router.navigate(['./instances'], {
        queryParamsHandling: 'preserve',
      });
    }),
  );

  @Effect()
  vmCreateSuccessLoadVolumes$: Observable<Action> = this.actions$.pipe(
    ofType(vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS),
    switchMap(() =>
      of(
        new volumeActions.LoadVolumesRequest(),
        new vmActions.DeploymentAddLoggerMessage({
          text: 'VM_PAGE.VM_CREATION.DEPLOYMENT_FINISHED',
          status: [ProgressLoggerMessageStatus.Highlighted],
        }),
      ),
    ),
  );

  @Effect({ dispatch: false })
  vmAccess$: Observable<VirtualMachine> = this.actions$.pipe(
    ofType(vmActions.ACCESS_VM),
    map((action: vmActions.AccessVm) => action.payload),
    tap((vm: VirtualMachine) => {
      return this.dialog.open(VmAccessComponent, {
        width: '700px',
        data: vm,
      });
    }),
  );

  @Effect({ dispatch: false })
  vmPulse$: Observable<VirtualMachine> = this.actions$.pipe(
    ofType(vmActions.PULSE_VM),
    map((action: vmActions.PulseVm) => action.payload),
    tap((vm: VirtualMachine) => {
      return this.dialog.open(VmPulseComponent, { data: vm.id });
    }),
  );

  @Effect({ dispatch: false })
  vmWebShell$: Observable<VirtualMachine> = this.actions$.pipe(
    ofType(vmActions.WEB_SHELL_VM),
    map((action: vmActions.WebShellVm) => action.payload),
    tap((vm: VirtualMachine) => this.sshModeService.openWindow(vm)),
  );

  @Effect({ dispatch: false })
  vmConsole$: Observable<VirtualMachine> = this.actions$.pipe(
    ofType(vmActions.CONSOLE_VM),
    map((action: vmActions.ConsoleVm) => action.payload),
    tap((vm: VirtualMachine) => this.vncModeService.openWindow(vm)),
  );

  @Effect({ dispatch: false })
  vmUrlAction$: Observable<VirtualMachine> = this.actions$.pipe(
    ofType(vmActions.OPEN_URL_VM),
    map((action: vmActions.OpenUrlVm) => action.payload),
    tap((vm: VirtualMachine) => this.httpModeService.openWindow(vm)),
  );

  @Effect({ dispatch: false })
  viewVmLogs$: Observable<VirtualMachine> = this.actions$.pipe(
    ofType(vmActions.VIEW_VM_LOGS),
    map((action: vmActions.ViewVmLogs) => action.payload),
    tap((vm: VirtualMachine) =>
      this.router.navigate(['logs'], {
        queryParams: {
          vm: vm.id,
        },
      }),
    ),
  );

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
    private tagService: TagService,
    private httpModeService: HttpAccessService,
    private sshModeService: SshAccessService,
    private vncModeService: VncAccessService,
  ) {}

  public stop(vm) {
    const notificationId = this.jobsNotificationService.add('NOTIFICATIONS.VM.STOP_IN_PROGRESS');
    this.update(vm, VmState.InProgress);
    return this.vmService.command(vm, CSCommands.Stop).pipe(
      tap(() => {
        const message = 'NOTIFICATIONS.VM.STOP_DONE';
        this.showNotificationsOnFinish(message, notificationId);
      }),
      catchError((error: Error) => {
        const message = 'NOTIFICATIONS.VM.STOP_FAILED';
        this.dialogService.showNotificationsOnFail(error, message, notificationId);
        return of(
          new vmActions.VMUpdateError({
            vm,
            error,
            state: VmState.Error,
          }),
        );
      }),
    );
  }

  private showPasswordDialog(vm: VirtualMachine, translationToken: string) {
    this.dialog.open(VmPasswordDialogComponent, {
      data: {
        vm,
        translationToken,
      },
      width: '400px',
    });
  }

  private start(vm: VirtualMachine) {
    const notificationId = this.jobsNotificationService.add('NOTIFICATIONS.VM.START_IN_PROGRESS');
    this.update(vm, VmState.InProgress);
    return this.vmService.command(vm, CSCommands.Start).pipe(
      tap(runningVm => {
        const message = 'NOTIFICATIONS.VM.START_DONE';
        this.showNotificationsOnFinish(message, notificationId);
        if (runningVm.password) {
          this.showPasswordDialog(runningVm, 'VM_PASSWORD.PASSWORD_HAS_BEEN_SET');
        }
      }),
      map((newVm: VirtualMachine) => new vmActions.UpdateVM(newVm)),
      catchError((error: Error) => {
        const message = 'NOTIFICATIONS.VM.START_FAILED';
        this.dialogService.showNotificationsOnFail(error, message, notificationId);
        return of(
          new vmActions.VMUpdateError({
            error,
            vm,
            state: VmState.Error,
          }),
        );
      }),
    );
  }

  private update(vm: VirtualMachine, state: VmState) {
    this.store.dispatch(new vmActions.UpdateVM({ ...vm, state }));
  }

  private askToStopVM(vm: VirtualMachine, message: string): Observable<any> {
    if (vm.state === VmState.Stopped) {
      return of(vm);
    }

    return this.dialogService
      .confirm({
        message,
        confirmText: 'COMMON.OK',
        declineText: 'COMMON.CANCEL',
      })
      .pipe(
        onErrorResumeNext(),
        filter(Boolean),
      );
  }

  private showNotificationsOnFinish(message: string, jobNotificationId?: string) {
    if (jobNotificationId) {
      this.jobsNotificationService.finish({
        message,
        id: jobNotificationId,
      });
    }
    this.snackBarService.open(message).subscribe();
  }
}
