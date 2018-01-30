import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { flatMap } from 'rxjs/operators';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { VmPulseComponent } from '../../../pulse/vm-pulse/vm-pulse.component';
// tslint:disable-next-line
import { ProgressLoggerMessageStatus } from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { AuthService } from '../../../shared/services/auth.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { IsoService } from '../../../template/shared/iso.service';
import { VmDestroyDialogComponent } from '../../../vm/shared/vm-destroy-dialog/vm-destroy-dialog.component';
import {
  getPath,
  getPort,
  getProtocol,
  VirtualMachine,
  VmState
} from '../../../vm/shared/vm.model';
import { VmService } from '../../../vm/shared/vm.service';
import { VmAccessComponent } from '../../../vm/vm-actions/vm-actions-component/vm-access.component';
// tslint:disable-next-line
import { VmResetPasswordComponent } from '../../../vm/vm-actions/vm-reset-password-component/vm-reset-password.component';
import { WebShellService } from '../../../vm/web-shell/web-shell.service';
import { State } from '../../index';
import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as sgActions from '../../security-groups/redux/sg.actions';

import * as vmActions from './vm.actions';


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
        'JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_IN_PROGRESS');
      return this.vmService.getList(action.payload)
        .do(() => this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_DONE'
        }))
        .map((vms: VirtualMachine[]) => new vmActions.UpdateVM(vms[0]))
        .catch((error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  changeDescription$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_DESCRIPTION)
    .switchMap((action: vmActions.ChangeDescription) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_IN_PROGRESS');
      return (action.payload.description ? this.vmTagService
        .setDescription(action.payload.vm, action.payload.description) : this.vmTagService
        .removeDescription(action.payload.vm))
        .do(() => this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_DONE'
        }))
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  changeServiceOffering$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_SERVICE_OFFERING)
    .switchMap((action: vmActions.ChangeServiceOffering) => {
      if (action.payload.vm.state === VmState.Running) {
        return this.stop(action.payload.vm).map(() => action);
      } else {
        return Observable.of(action);
      }
    })
    .switchMap(changeAction => {
      const vmState = changeAction.payload.vm.state;
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_IN_PROGRESS');

      return this.vmService
        .changeServiceOffering(changeAction.payload.offering, changeAction.payload.vm)
        .do(() => this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE'
        }))
        .switchMap((newVm) => {
          if (vmState === VmState.Running) {
            return this.start(newVm);
          } else {
            return Observable.of(new vmActions.UpdateVM(newVm));
          }
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_FAILED'
          });
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
    .switchMap((action: vmActions.ChangeAffinityGroup) => {
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
            'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_IN_PROGRESS');

          return this.affinityGroupService.updateForVm(
            changeAction.payload.vm.id,
            changeAction.payload.affinityGroupId
          )
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_DONE'
            }))
            .switchMap((newVm) => {
              if (vmState === VmState.Running) {
                return this.start(newVm);
              } else {
                return Observable.of(new vmActions.UpdateVM(newVm));
              }
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_FAILED'
              });
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
    .switchMap((action: vmActions.ChangeInstanceGroup) => {
      const newVm = Object.assign(
        {},
        action.payload.vm,
        { instanceGroup: action.payload.group }
      );
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_IN_PROGRESS');

      return this.vmTagService.setGroup(newVm, action.payload.group)
        .do(() => this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_DONE'
        }))
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_INSTANCE_GROUP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  removeInstanceGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_INSTANCE_GROUP)
    .switchMap((action: vmActions.RemoveInstanceGroup) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_IN_PROGRESS');

      return this.vmTagService.removeGroup(action.payload)
        .do(() => this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_DONE'
        }))
        .map(vm => {
          const newVm = Object.assign(
            {},
            vm,
            { instanceGroup: undefined }
          );
          return new vmActions.UpdateVM(newVm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_INSTANCE_GROUP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  addSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_ADD_SECONDARY_IP)
    .switchMap((action: vmActions.AddSecondaryIp) => {
      return this.vmService.addIpToNic(action.payload.nicId)
        .do(() => this.jobsNotificationService.finish({
          message: 'JOB_NOTIFICATIONS.VM.ADD_SECONDARY_IP_DONE'
        }))
        .map(res => {
          const newSecondaryIp = Object.assign([], action.payload.vm.nic[0].secondaryip);
          newSecondaryIp.push(res.result.nicsecondaryip);
          const newNic = Object.assign(
            {},
            action.payload.vm.nic[0],
            { secondaryIp: newSecondaryIp }
          );
          const newVm = Object.assign(
            {},
            action.payload.vm,
            { nic: [newNic] }
          );
          return new vmActions.UpdateVM(newVm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            message: 'JOB_NOTIFICATIONS.VM.ADD_SECONDARY_IP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  removeSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_SECONDARY_IP)
    .switchMap((action: vmActions.RemoveSecondaryIp) => {
      return this.vmService.removeIpFromNic(action.payload.id)
        .do(() => this.jobsNotificationService.finish({
          message: 'JOB_NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_DONE'
        }))
        .map(res => {
          const newSecondaryIp = Object.assign([], action.payload.vm.nic[0].secondaryip)
            .filter(ip => ip.id !== action.payload.id);
          const newNic = Object.assign(
            {},
            action.payload.vm.nic[0],
            { secondaryIp: newSecondaryIp }
          );
          const newVm = Object.assign(
            {},
            action.payload.vm,
            { nic: [newNic] }
          );
          return new vmActions.UpdateVM(newVm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  changeColor$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_COLOR)
    .switchMap((action: vmActions.ChangeVmColor) => {
      return this.vmTagService.setColor(action.payload.vm, action.payload.color)
        .do(() => this.jobsNotificationService.finish({
          message: 'JOB_NOTIFICATIONS.VM.COLOR_CHANGE_DONE'
        }))
        .map(vm => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            message: 'JOB_NOTIFICATIONS.VM.COLOR_CHANGE_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  stopVm$: Observable<Action> = this.actions$
    .ofType(vmActions.STOP_VM)
    .flatMap((action: vmActions.StopVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_STOP' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.STOP_IN_PROGRESS');
          this.update(action.payload, VmState.Running);
          return this.vmService.command(action.payload, 'stop')
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.STOP_DONE'
            }))
            .map(vm => new vmActions.UpdateVM(vm))
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.STOP_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError({
                vm: action.payload,
                state: VmState.Error,
                error
              }));
            });
        });
    });

  @Effect()
  startVm$: Observable<Action> = this.actions$
    .ofType(vmActions.START_VM)
    .flatMap((action: vmActions.StartVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_START' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          return this.start(action.payload);
        });
    });

  @Effect()
  destroyVm$: Observable<Action> = this.actions$
    .ofType(vmActions.DESTROY_VM)
    .flatMap((action: vmActions.DestroyVm) => {
      return this.dialog.open(VmDestroyDialogComponent, {
        data: this.authService.canExpungeOrRecoverVm()
      }).afterClosed()
        .filter(res => Boolean(res))
        .switchMap((params) => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.DESTROY_IN_PROGRESS');
          this.update(action.payload, VmState.InProgress);

          const actions = flatMap((vm: VirtualMachine): Action[] => {
            if (params.expunge) {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE'
              });
              return [
                new vmActions.ExpungeVmSuccess(action.payload),
                new volumeActions.DeleteVolumes(action.payload),
                new sgActions.DeletePrivateSecurityGroup(action.payload)
              ];
            } else {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.DESTROY_DONE'
              });
              return [
                new vmActions.UpdateVM(vm),
                new volumeActions.DeleteVolumes(action.payload)
              ];
            }
          });

          return this.vmService.command(action.payload, 'destroy', params)
            .pipe(actions)
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.DESTROY_FAILED'
              });
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
    .flatMap((action: vmActions.RebootVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.REBOOT_IN_PROGRESS');
          this.update(action.payload, VmState.InProgress);
          return this.vmService.command(action.payload, 'reboot')
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.REBOOT_DONE'
            }))
            .map(vm => new vmActions.UpdateVM(vm))
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.REBOOT_FAILED'
              });
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
    .flatMap((action: vmActions.RestoreVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.RESTORE_IN_PROGRESS');
          this.update(action.payload, VmState.InProgress);

          return this.vmService.command(action.payload, 'restore')
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.RESTORE_DONE'
            }))
            .map(newVm => new vmActions.UpdateVM(newVm))
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RESTORE_FAILED'
              });
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
    .flatMap((action: vmActions.RecoverVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.RECOVER_IN_PROGRESS');
          this.update(action.payload, VmState.InProgress);
          return this.vmService.commandSync(action.payload, 'recover')
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.RECOVER_DONE'
            }))
            .map(res => new vmActions.UpdateVM(res.virtualmachine))
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RECOVER_FAILED'
              });
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
    .flatMap((action: vmActions.ExpungeVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS');
          const actions = flatMap((): Action[]  => {
            return [
              new vmActions.ExpungeVmSuccess(action.payload),
              new sgActions.DeletePrivateSecurityGroup(action.payload)
            ];
          });

          return this.vmService.command(action.payload, 'expunge')
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE'
            }))
            .pipe(actions)
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError({ error }));
            });
        });
    });

  @Effect()
  attachIso$: Observable<Action> = this.actions$
    .ofType(vmActions.ATTACH_ISO)
    .switchMap((action: vmActions.AttachIso) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.ISO.ATTACHMENT_IN_PROGRESS');
      return this.isoService.attach(action.payload)
        .do(() => this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.ISO.ATTACHMENT_DONE'
        }))
        .map((vm) => new vmActions.UpdateVM(vm))
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.ISO.ATTACHMENT_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  detachIso$: Observable<Action> = this.actions$
    .ofType(vmActions.DETACH_ISO)
    .switchMap((action: vmActions.DetachIso) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.ISO.DETACHMENT_IN_PROGRESS');
      return this.isoService.detach(action.payload)
        .do(() => this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.ISO.DETACHMENT_DONE'
        }))
        .map((vm) => new vmActions.ReplaceVM(vm))
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.DETACHMENT_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError({ error }));
        });
    });

  @Effect()
  changeSshKey$: Observable<Action> = this.actions$
    .ofType(vmActions.CHANGE_SSH_KEY)
    .switchMap((action: vmActions.ChangeSshKey) => {
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
            'JOB_NOTIFICATIONS.VM.CHANGE_SSH_IN_PROGRESS');

          return this.sshService.reset({
            keypair: changeAction.payload.keyPair,
            id: changeAction.payload.vm.id,
            account: changeAction.payload.vm.account,
            domainid: changeAction.payload.vm.domainid
          })
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SSH_DONE'
            }))
            .switchMap((newVm) => {
              if (vmState === VmState.Running) {
                return this.start(newVm);
              } else {
                return Observable.of(new vmActions.UpdateVM(newVm));
              }
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.CHANGE_SSH_FAILED'
              });
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
    .flatMap((action: vmActions.ResetPasswordVm) => {
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
        .switchMap(resetAction => {
          const vmState = resetAction.payload.state;
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_IN_PROGRESS');

          return this.vmService.command(resetAction.payload, 'resetPasswordFor')
            .do(() => this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_DONE'
            }))
            .switchMap((newVm) => {
              if (vmState === VmState.Running) {
                return this.start(newVm)
                  .do(() => this.showPasswordDialog(newVm));
              }
              this.showPasswordDialog(newVm);
              return Observable.of(new vmActions.UpdateVM(newVm));
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError({
                vm: resetAction.payload,
                state: VmState.Error,
                error
              }));
            });
        });
    });

  @Effect()
  saveNewPassword$: Observable<Action> = this.actions$
    .ofType(vmActions.SAVE_NEW_VM_PASSWORD)
    .switchMap((action: vmActions.SaveNewPassword) => {
      return this.showConfirmDialog().switchMap(() =>
        this.vmTagService.setPassword(action.payload.vm, action.payload.tag)
          .do(() => this.jobsNotificationService.finish({
            message: 'JOB_NOTIFICATIONS.VM.SAVE_PASSWORD_DONE'
          }))
          .map((vm) => new vmActions.UpdateVM(vm))
          .catch((error: Error) => {
            this.jobsNotificationService.fail({
              message: 'JOB_NOTIFICATIONS.VM.SAVE_PASSWORD_FAILED'
            });
            return Observable.of(new vmActions.VMUpdateError({ error }));
          }));
    });

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_UPDATE_ERROR)
    .do((action: vmActions.VMUpdateError) => {
      if (action.payload.vm && action.payload.state) {
        this.update(action.payload.vm, action.payload.state);
      }
      this.handleError(action.payload.error);
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
    this.dialog.open(VmResetPasswordComponent, {
      data: vm,
      width: '400px'
    });
  }

  private showConfirmDialog(): Observable<any> {
    return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_SAVE_PASSWORD' })
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          this.userTagService.setSavePasswordForAllVms(true);
        }
        return Observable.of(null);
      });
  }

  private isVMStopped(vm: VirtualMachine): boolean {
    return vm.state === VmState.Stopped;
  }

  private start(vm) {
    const notificationId = this.jobsNotificationService.add(
      'JOB_NOTIFICATIONS.VM.START_IN_PROGRESS');
    this.update(vm, VmState.InProgress);
    return this.vmService.command(vm, 'start')
      .do(() => this.jobsNotificationService.finish({
        id: notificationId,
        message: 'JOB_NOTIFICATIONS.VM.START_DONE'
      }))
      .map((newVm) => new vmActions.UpdateVM(new VirtualMachine(
        Object.assign({}, vm, newVm))))
      .catch((error: Error) => {
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.START_FAILED'
        });
        return Observable.of(new vmActions.VMUpdateError({
          vm,
          state: VmState.Error,
          error
        }));
      });
  }

  private stop(vm) {
    const notificationId = this.jobsNotificationService.add(
      'JOB_NOTIFICATIONS.VM.STOP_IN_PROGRESS');
    this.update(vm, VmState.InProgress);
    return this.vmService.command(vm, 'stop')
      .do(() => this.jobsNotificationService.finish({
        id: notificationId,
        message: 'JOB_NOTIFICATIONS.VM.STOP_DONE'
      }))
      .switchMap((newVm) => Observable.of(newVm))
      .catch((error: Error) => {
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.STOP_FAILED'
        });
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
}
