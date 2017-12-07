import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VmPulseComponent } from '../../../pulse/vm-pulse/vm-pulse.component';
import { WebShellService } from '../../../vm/web-shell/web-shell.service';
import { Action, Store } from '@ngrx/store';
import { VmService } from '../../../vm/shared/vm.service';
import { VirtualMachine, VmState, getPath, getPort, getProtocol } from '../../../vm/shared/vm.model';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { DialogService, ParametrizedTranslation } from '../../../dialog/dialog-service/dialog.service';
import { IsoService } from '../../../template/shared/iso.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
// tslint:disable-next-line
import { VmResetPasswordComponent } from '../../../vm/vm-actions/vm-reset-password-component/vm-reset-password.component';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { Router } from '@angular/router';
import { VmDestroyDialogComponent } from '../../../vm/shared/vm-destroy-dialog/vm-destroy-dialog.component';
import { AuthService } from '../../../shared/services/auth.service';
import { DiskOffering, ServiceOffering, Zone } from '../../../shared/models';
import { FormState } from './vm.reducers';
import { TemplateTagService } from '../../../shared/services/tags/template-tag.service';
import { BaseTemplateModel } from '../../../template/shared';
import { Utils } from '../../../shared/services/utils/utils.service';
import {
  VmDeploymentMessage, VmDeploymentService,
  VmDeploymentStage
} from '../../../vm/vm-creation/services/vm-deployment.service';
// tslint:disable-next-line
import { ProgressLoggerMessageStatus } from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { VmCreationAgreementComponent } from '../../../vm/vm-creation/template/agreement/vm-creation-agreement.component';
import { ProgressLoggerController } from '../../../shared/components/progress-logger/progress-logger.service';
import { VmCreationState } from '../../../vm/vm-creation/data/vm-creation-state';
import { ResourceUsageService } from '../../../shared/services/resource-usage.service';
import { Effect } from '@ngrx/effects';

import * as vmActions from './vm.actions';
import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromZones from '../../zones/redux/zones.reducers';
import * as fromServiceOfferings from '../../service-offerings/redux/service-offerings.reducers';
import * as fromTemplates from '../../templates/redux/template.reducers';
import * as fromDiskOfferings from '../../disk-offerings/redux/disk-offerings.reducers';


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
        .map((vms: VirtualMachine[]) => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_DONE'
          });
          return new vmActions.UpdateVM(vms[0]);
        })
        .catch((error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.FETCH_STATISTICS_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
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
        .map(vm => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_DONE'
          });
          return new vmActions.UpdateVM(vm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_DESCRIPTION_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  changeServiceOffering$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_SERVICE_OFFERING)
    .switchMap((action: vmActions.ChangeServiceOffering) => {
      const vmState = action.payload.vm.state;

      const change = (changeAction) => {
        const notificationId = this.jobsNotificationService.add(
          'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_IN_PROGRESS');

        return this.vmService
          .changeServiceOffering(changeAction.payload.offering, changeAction.payload.vm)
          .switchMap((newVm) => {
            this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE'
            });
            if (vmState === VmState.Running) {
              this.store.dispatch(new vmActions.UpdateVM(newVm));
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
            return Observable.of(new vmActions.VMUpdateError(error));
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
      return this.askToStopVM(
        action.payload.vm,
        'VM_PAGE.VM_DETAILS.AFFINITY_GROUP.STOP_MACHINE_FOR_AG'
      )
        .switchMap(() => {
          const vmState = action.payload.vm.state;

          const change = (changeAction) => {
            const notificationId = this.jobsNotificationService.add(
              'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_IN_PROGRESS');

            return this.affinityGroupService.updateForVm(
              changeAction.payload.vm.id,
              changeAction.payload.affinityGroupId
            )
              .switchMap((newVm) => {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VM.CHANGE_AFFINITY_GROUP_DONE'
                });
                if (vmState === VmState.Running) {
                  this.store.dispatch(new vmActions.UpdateVM(newVm));
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
                return Observable.of(new vmActions.VMUpdateError(error));
              });
          };

          if (!this.isVMStopped(action.payload.vm)) {
            return this.stop(action.payload.vm)
              .switchMap(() => change(action));
          } else {
            return change(action);
          }
        });
    });

  @Effect()
  changeInstanceGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_INSTANT_GROUP)
    .switchMap((action: vmActions.ChangeInstanceGroup) => {
      const newVm = Object.assign(
        {},
        action.payload.vm,
        { instanceGroup: action.payload.group }
      );
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VM.CHANGE_INSTANT_GROUP_IN_PROGRESS');

      return this.vmTagService.setGroup(newVm, action.payload.group)
        .map(vm => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_INSTANT_GROUP_DONE'
          });
          return new vmActions.UpdateVM(vm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.CHANGE_INSTANT_GROUP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  removeInstanceGroup$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_INSTANT_GROUP)
    .switchMap((action: vmActions.RemoveInstanceGroup) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VM.REMOVE_INSTANT_GROUP_IN_PROGRESS');

      return this.vmTagService.removeGroup(action.payload)
        .map(vm => {
          const newVm = Object.assign(
            {},
            vm,
            { instanceGroup: undefined }
          );
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_INSTANT_GROUP_DONE'
          });
          return new vmActions.UpdateVM(newVm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_INSTANT_GROUP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  addSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_ADD_SECONDARY_IP)
    .switchMap((action: vmActions.AddSecondaryIp) => {
      return this.vmService.addIpToNic(action.payload.nicId)
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
          this.jobsNotificationService.finish({
            message: 'JOB_NOTIFICATIONS.VM.ADD_SECONDARY_IP_DONE'
          });
          return new vmActions.UpdateVM(newVm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            message: 'JOB_NOTIFICATIONS.VM.ADD_SECONDARY_IP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  removeSecondaryIp$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_REMOVE_SECONDARY_IP)
    .switchMap((action: vmActions.RemoveSecondaryIp) => {
      return this.vmService.removeIpFromNic(action.payload.id)
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
          this.jobsNotificationService.finish({
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_DONE'
          });
          return new vmActions.UpdateVM(newVm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            message: 'JOB_NOTIFICATIONS.VM.REMOVE_SECONDARY_IP_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  changeColor$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_COLOR)
    .switchMap((action: vmActions.ChangeVmColor) => {
      return this.vmTagService.setColor(action.payload.vm, action.payload.color)
        .map(vm => {
          this.jobsNotificationService.finish({
            message: 'JOB_NOTIFICATIONS.VM.COLOR_CHANGE_DONE'
          });
          return new vmActions.UpdateVM(vm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            message: 'JOB_NOTIFICATIONS.VM.COLOR_CHANGE_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  stopVm$: Observable<Action> = this.actions$
    .ofType(vmActions.STOP_VM)
    .switchMap((action: vmActions.StopVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_STOP' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.STOP_IN_PROGRESS');
          this.update(action.payload);
          return this.vmService.command(action.payload, 'stop')
            .map(vm => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.STOP_DONE'
              });
              return new vmActions.UpdateVM(vm);
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.STOP_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError(error));
            });
        });
    });

  @Effect()
  startVm$: Observable<Action> = this.actions$
    .ofType(vmActions.START_VM)
    .switchMap((action: vmActions.StartVm) => {
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
    .switchMap((action: vmActions.DestroyVm) => {
      return this.dialog.open(VmDestroyDialogComponent, {
        data: this.authService.canExpungeOrRecoverVm()
      }).afterClosed()
        .filter(res => Boolean(res))
        .switchMap((params) => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.DESTROY_IN_PROGRESS');
          this.update(action.payload);
          return this.vmService.command(action.payload, 'destroy', params)
            .map(vm => {
              if (params.expunge) {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE'
                });
                return new vmActions.ExpungeVmSuccess(action.payload);
              } else {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VM.DESTROY_DONE'
                });
                return new vmActions.UpdateVM(vm);
              }
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.DESTROY_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError(error));
            });
        });
    });

  @Effect()
  rebootVm$: Observable<Action> = this.actions$
    .ofType(vmActions.REBOOT_VM)
    .switchMap((action: vmActions.RebootVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.REBOOT_IN_PROGRESS');
          this.update(action.payload);
          return this.vmService.command(action.payload, 'reboot')
            .map(vm => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.REBOOT_DONE'
              });
              return new vmActions.UpdateVM(vm);
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.REBOOT_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError(error));
            });
        });
    });

  @Effect()
  restoreVm$: Observable<Action> = this.actions$
    .ofType(vmActions.RESTORE_VM)
    .switchMap((action: vmActions.RestoreVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.RESTORE_IN_PROGRESS');
          this.update(action.payload);

          return this.vmService.command(action.payload, 'restore')
            .map(newVm => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RESTORE_DONE'
              });
              return new vmActions.UpdateVM(newVm);
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RESTORE_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError(error));
            });
        });
    });

  @Effect()
  recoverVm$: Observable<Action> = this.actions$
    .ofType(vmActions.RECOVER_VM)
    .switchMap((action: vmActions.RecoverVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.RECOVER_IN_PROGRESS');
          this.update(action.payload);
          return this.vmService.commandSync(action.payload, 'recover')
            .map(res => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RECOVER_DONE'
              });
              return new vmActions.UpdateVM(res.virtualmachine);
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.RECOVER_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError(error));
            });
        });
    });

  @Effect()
  expungeVm$: Observable<Action> = this.actions$
    .ofType(vmActions.EXPUNGE_VM)
    .switchMap((action: vmActions.ExpungeVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS');
          return this.vmService.command(action.payload, 'expunge')
            .map(vm => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE'
              });
              return new vmActions.ExpungeVmSuccess(action.payload);
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.EXPUNGE_FAILED'
              });
              return Observable.of(new vmActions.VMUpdateError(error));
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
        .map((vm) => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.ISO.ATTACHMENT_DONE'
          });
          return new vmActions.UpdateVM(vm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.ISO.ATTACHMENT_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
        });
    });

  @Effect()
  detachIso$: Observable<Action> = this.actions$
    .ofType(vmActions.DETACH_ISO)
    .switchMap((action: vmActions.AttachIso) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.ISO.DETACHMENT_IN_PROGRESS');
      return this.isoService.detach(action.payload)
        .map((vm) => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.ISO.DETACHMENT_DONE'
          });
          return new vmActions.ReplaceVM(vm);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VM.DETACHMENT_FAILED'
          });
          return Observable.of(new vmActions.VMUpdateError(error));
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
          const vmState = action.payload.vm.state;

          const change = (changeAction) => {
            const notificationId = this.jobsNotificationService.add(
              'JOB_NOTIFICATIONS.VM.CHANGE_SSH_IN_PROGRESS');

            return this.sshService.reset({
              keypair: changeAction.payload.keyPair,
              id: changeAction.payload.vm.id,
              account: changeAction.payload.vm.account,
              domainid: changeAction.payload.vm.domainid
            })
              .switchMap((newVm) => {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VM.CHANGE_SSH_DONE'
                });
                if (vmState === VmState.Running) {
                  this.store.dispatch(new vmActions.UpdateVM(newVm));
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
                return Observable.of(new vmActions.VMUpdateError(error));
              });
          };

          if (!this.isVMStopped(action.payload.vm)) {
            return this.stop(action.payload.vm)
              .switchMap(() => change(action));
          } else {
            return change(action);
          }
        });
    });

  @Effect()
  resetPassword$: Observable<Action> = this.actions$
    .ofType(vmActions.RESET_PASSWORD_VM)
    .switchMap((action: vmActions.ResetPasswordVm) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const vmState = action.payload.state;

          const reset = (vm) => {
            const notificationId = this.jobsNotificationService.add(
              'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_IN_PROGRESS');

            return this.vmService.command(vm, 'resetPasswordFor')
              .switchMap((newVm) => {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_DONE'
                });
                if (vmState === VmState.Running) {
                  this.store.dispatch(new vmActions.UpdateVM(newVm));
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
                return Observable.of(new vmActions.VMUpdateError(error));
              });
          };

          if (!this.isVMStopped(action.payload)) {
            return this.stop(action.payload)
              .switchMap(() => reset(action.payload));
          } else {
            return reset(action.payload);
          }
        });
    });

  @Effect()
  saveNewPassword$: Observable<Action> = this.actions$
    .ofType(vmActions.SAVE_NEW_VM_PASSWORD)
    .switchMap((action: vmActions.SaveNewPassword) => {
      return this.showConfirmDialog().switchMap(() =>
        this.vmTagService.setPassword(action.payload.vm, action.payload.tag)
          .map((vm) => {
            this.jobsNotificationService.finish({
              message: 'JOB_NOTIFICATIONS.VM.SAVE_PASSWORD_DONE'
            });
            return new vmActions.UpdateVM(vm);
          })
          .catch((error: Error) => {
            this.jobsNotificationService.fail({
              message: 'JOB_NOTIFICATIONS.VM.SAVE_PASSWORD_FAILED'
            });
            return Observable.of(new vmActions.VMUpdateError(error));
          }));
    });

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_UPDATE_ERROR)
    .do((action: vmActions.VMUpdateError) => {
      this.handleError(action.payload);
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
    .ofType(vmActions.CREATE_VM_SUCCESS)
    .map(() => new volumeActions.LoadVolumesRequest());

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

  @Effect()
  vmCreationFormUpdate$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_FORM_UPDATE)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .withLatestFrom(this.store.select(fromZones.selectAll))
    .withLatestFrom(this.store.select(fromTemplates.selectTemplatesForVmCreation))
    .withLatestFrom(this.store.select(fromServiceOfferings.getAvailableOfferingsForVmCreation))
    .withLatestFrom(this.store.select(fromDiskOfferings.selectAll))
    .map(([[[[[action, vmCreationState], zones],
      templates], serviceOfferings], diskOfferings]: [[[[[vmActions.VmFormUpdate, FormState],
      Zone[]], BaseTemplateModel[]], ServiceOffering[]], DiskOffering[]]) => {
      if (vmCreationState.state && !vmCreationState.state.zone && zones.length) {
        return new vmActions.VmFormUpdate({ zone: zones[0] });
      }

      if (!!action.payload.zone) {
        let updates = {};

        const selectedServiceOffetingStillAvailable = vmCreationState.state.serviceOffering
          && serviceOfferings.find(_ => _.id === vmCreationState.state.serviceOffering.id);
        const selectedTemplateStillAvailable = vmCreationState.state.template
          && templates.find(_ => _.id === vmCreationState.state.template.id);

        if (!selectedServiceOffetingStillAvailable) {
          updates = Object.assign({}, updates, { serviceOffering: serviceOfferings[0] });
        }

        if (!selectedTemplateStillAvailable) {
          updates = Object.assign({}, updates, { template: templates[0] });
        }

        return new vmActions.VmFormUpdate(updates);
      }

      if (action.payload.template) {
        if (action.payload.template.isTemplate) {
          return new vmActions.VmFormUpdate({ rootDiskSize: action.payload.template.sizeInGB });
        } else if (!vmCreationState.state.diskOffering) {
          return new vmActions.VmFormUpdate({ diskOffering: diskOfferings[0] });
        }
      }

      if (action.payload.diskOffering) {
        if (!action.payload.diskOffering.isCustomized || !vmCreationState.state.template) {
          return new vmActions.VmFormUpdate({ rootDiskMinSize: null });
        } else {
          const defaultDiskSize = this.auth.getCustomDiskOfferingMinSize() || 1;
          const minSize = Math.ceil(Utils.convertToGb(vmCreationState.state.template.size)) || defaultDiskSize;
          // e.g. 20000000000 B converts to 20 GB; 200000000 B -> 0.2 GB -> 1 GB; 0 B -> 1 GB
          let updates = Object.assign({}, { rootDiskMinSize: minSize });
          if (!vmCreationState.state.rootDiskSize
            || vmCreationState.state.rootDiskSize < vmCreationState.state.rootDiskMinSize) {
            updates = Object.assign({}, updates, { rootDiskSize: minSize });
          }
          return new vmActions.VmFormUpdate(updates);
        }
      }

      if (vmCreationState.state.zone) {
        if (!vmCreationState.state.serviceOffering && serviceOfferings) {
          return new vmActions.VmFormUpdate({ serviceOffering: serviceOfferings[0] });
        }

        if (!vmCreationState.state.template && templates) {
          return new vmActions.VmFormUpdate({ template: templates[0] });
        }
      }

      return new vmActions.VmFormUpdateSuccess();
    });


  @Effect()
  deployVm$ = this.actions$
    .ofType(vmActions.DEPLOY_VM)
    .switchMap((action: vmActions.DeployVm) => {
      return this.templateTagService.getAgreement(action.payload.state.template)
        .switchMap(res => res ? this.showTemplateAgreementDialog(action.payload.state) : Observable.of(true))
        .filter(res => !!res)
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VM.DEPLOY_IN_PROGRESS'
          );

          this.initializeDeploymentActionList(action.payload);

          return this.vmDeploymentService.deploy()
            .map((observables: VmDeployObservables) => {
              observables.deployStatusObservable.subscribe(deploymentMessage => {
                this.handleDeploymentMessages(action.payload, deploymentMessage, notificationId);
              });

              return new vmActions.DeployActiomVm(observables.deployStatusObservable);
            });
        });
    });

  @Effect()
  startDeployVm$ = this.actions$
    .ofType(vmActions.DEPLOY_ACTION_VM)
    .withLatestFrom(this.store.select(fromVMs.getVmFormState))
    .switchMap(([action, state]: [vmActions.DeployActiomVm, FormState]) => {
      let deployedVm;
      let tempVm;
      return Observable.of(null)
        .do(() => {
          action.payload.next({
            stage: VmDeploymentStage.STARTED
          });
        })
        .switchMap(() => this.vmDeploymentService.getPreDeployActions(action.payload, state.state))
        .switchMap(modifiedState => this.vmDeploymentService.sendDeployRequest(action.payload, modifiedState))
        .switchMap(({ deployResponse, temporaryVm }) => {
          tempVm = temporaryVm;
          return this.vmService.registerVmJob(deployResponse);
        })
        .switchMap(vm => {
          deployedVm = vm;
          action.payload.next({
            stage: VmDeploymentStage.VM_DEPLOYED
          });
          return this.vmDeploymentService.getPostDeployActions(action.payload, state.state, vm);
        })
        .map(() => {
          this.vmDeploymentService.handleSuccessfulDeployment(deployedVm, action.payload);
          return new vmActions.CreateVmSuccess(deployedVm);
        })
        .catch((error) => {
          this.vmDeploymentService.handleFailedDeployment(error, tempVm, action.payload);
          return Observable.of(new vmActions.CreateVmError(error));
        });
    });

  @Effect()
  initVmCreation$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_FORM_INIT)
    .switchMap((action: vmActions.VmCreationFormInit) => this.resourceUsageService.getResourceUsage()
      .switchMap(resourceUsage => {
        const insufficientResources = [];

        Object.keys(resourceUsage.available)
          .filter(
            key => key !== 'snapshots' && key !== 'secondaryStorage' && key !== 'ips')
          .forEach(key => {
            const available = resourceUsage.available[key];
            if (available === 0) {
              insufficientResources.push(key);
            }
          });

        const enoughResources = !insufficientResources.length;
        return Observable.of(new vmActions.VmCreationStateUpdate({ enoughResources }));
      }));

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
    private templateTagService: TemplateTagService,
    private dialog: MatDialog,
    private router: Router,
    private auth: AuthService,
    private vmDeploymentService: VmDeploymentService,
    private resourceUsageService: ResourceUsageService
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
      .filter(res => !!res)
      .switchMap((res) => {
        this.userTagService.setSavePasswordForAllVms(true);
        return Observable.of(null);
      });
  }

  private isVMStopped(vm: VirtualMachine): boolean {
    return vm.state === VmState.Stopped;
  }

  private start(vm) {
    const notificationId = this.jobsNotificationService.add(
      'JOB_NOTIFICATIONS.VM.START_IN_PROGRESS');
    this.update(vm);
    return this.vmService.command(vm, 'start')
      .map((newVm) => {
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.START_DONE'
        });
        return new vmActions.UpdateVM(new VirtualMachine(
          Object.assign({}, vm, newVm)));
      })
      .catch((error: Error) => {
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.START_FAILED'
        });
        return Observable.of(new vmActions.VMUpdateError(error));
      });
  }

  private stop(vm) {
    const notificationId = this.jobsNotificationService.add(
      'JOB_NOTIFICATIONS.VM.STOP_IN_PROGRESS');
    this.update(vm);
    return this.vmService.command(vm, 'stop')
      .do((newVm) => {
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.STOP_DONE'
        });
        return this.store.dispatch(new vmActions.UpdateVM(newVm));
      })
      .catch((error: Error) => {
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VM.STOP_FAILED'
        });
        return Observable.of(new vmActions.VMUpdateError(error));
      });
  }

  private update(vm) {
    this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(Object.assign(
      {},
      vm,
      { state: VmState.InProgress }
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

  private showTemplateAgreementDialog(state: VmCreationState): Observable<BaseTemplateModel> {
    return this.dialog.open(VmCreationAgreementComponent, {
      width: '900px',
      data: state.template
    })
      .afterClosed();
  }


  public notifyOnDeployDone(notificationId: string): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_DONE'
    });
  }

  public notifyOnDeployFailed(error: any, notificationId: string, state: FormState): void {
    this.store.dispatch(new vmActions.VmCreationStateUpdate({ deploymentStopped: false }));
    this.store.dispatch(new vmActions.DeploymentAddLoggerMessage({
      text: error.params
        ? {
          translationToken: error.message,
          interpolateParams: error.params
        }
        : error.message,
      status: [ProgressLoggerMessageStatus.ErrorMessage]
    }));

    const inProgressMessage = state.loggerStageList.find(message => {
      return message.status && message.status.includes(ProgressLoggerMessageStatus.InProgress);
    });

    this.updateLoggerMessage(
      inProgressMessage && inProgressMessage.text,
      [ProgressLoggerMessageStatus.Error],
      state
    );

    this.jobsNotificationService.fail({
      id: notificationId,
      message: 'JOB_NOTIFICATIONS.VM.DEPLOY_FAILED'
    });
  }

  private handleDeploymentMessages(
    state: FormState,
    deploymentMessage: VmDeploymentMessage,
    notificationId: string
  ): void {
    switch (deploymentMessage.stage) {
      case VmDeploymentStage.STARTED:
        this.onVmDeploymentStarted(state);
        break;
      case VmDeploymentStage.AG_GROUP_CREATION:
        this.onAffinityGroupCreation(state);
        break;
      case VmDeploymentStage.AG_GROUP_CREATION_FINISHED:
        this.onAffinityGroupCreationFinished(state);
        break;
      case VmDeploymentStage.SG_GROUP_CREATION:
        this.onSecurityGroupCreation(state);
        break;
      case VmDeploymentStage.SG_GROUP_CREATION_FINISHED:
        this.onSecurityGroupCreationFinished(state);
        break;
      case VmDeploymentStage.VM_CREATION_IN_PROGRESS:
        this.onVmCreationInProgress(state);
        break;
      case VmDeploymentStage.FINISHED:
        this.onVmDeploymentFinished(notificationId);
        break;
      case VmDeploymentStage.ERROR:
        this.notifyOnDeployFailed(deploymentMessage.error, notificationId, state);
        break;
      case VmDeploymentStage.INSTANCE_GROUP_CREATION:
        this.onInstanceGroupCreation(state);
        break;
      case VmDeploymentStage.INSTANCE_GROUP_CREATION_FINISHED:
        this.onInstanceGroupCreationFinished(state);
        break;
      case VmDeploymentStage.TAG_COPYING:
        this.onTagCopying(state);
        break;
      case VmDeploymentStage.TAG_COPYING_FINISHED:
        this.onTagCopyingFinished(state);
        break;
      case VmDeploymentStage.VM_DEPLOYED:
        this.onVmCreationFinished(state);
        break;
    }
  }

  private getDeploymentActionList(state: VmCreationState): Array<VmDeploymentStage> {
    const doCreateAffinityGroup = state.affinityGroup && state.affinityGroup.name
      && !state.affinityGroupNames.includes(state.affinityGroup.name);
    const securityGroupsAreAllowed = state.zone && !state.zone.networkTypeIsBasic;
    const doCreateInstanceGroup = state.instanceGroup && state.instanceGroup.name;
    const doCopyTags = true;

    return [
      doCreateAffinityGroup ? VmDeploymentStage.AG_GROUP_CREATION : null,
      securityGroupsAreAllowed ? VmDeploymentStage.SG_GROUP_CREATION : null,
      VmDeploymentStage.VM_CREATION_IN_PROGRESS,
      doCreateInstanceGroup ? VmDeploymentStage.INSTANCE_GROUP_CREATION : null,
      doCopyTags ? VmDeploymentStage.TAG_COPYING : null
    ]
      .filter(_ => _);
  }

  private initializeDeploymentActionList(state: FormState): void {
    const translations = {
      'AG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_AG',
      'SG_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_SG',
      'VM_CREATION_IN_PROGRESS': 'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      'INSTANCE_GROUP_CREATION': 'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      'TAG_COPYING': 'VM_PAGE.VM_CREATION.TAG_COPYING'
    };

    const loggerStageList = [];

    this.getDeploymentActionList(state.state).forEach(actionName => {
      loggerStageList.push({ text: translations[actionName] });
    });

    this.store.dispatch(new vmActions.VmCreationStateUpdate({ loggerStageList }));

  }

  private onVmDeploymentStarted(state: FormState): void {
    this.store.dispatch(new vmActions.VmCreationStateUpdate({ showOverlay: true, deploymentStopped: false }));
  }

  private onAffinityGroupCreation(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_AG',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ],
      state
    );
  }

  private onAffinityGroupCreationFinished(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_AG',
      [ProgressLoggerMessageStatus.Done],
      state
    );
  }

  private onSecurityGroupCreation(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_SG',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ],
      state
    );
  }

  private onSecurityGroupCreationFinished(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_SG',
      [ProgressLoggerMessageStatus.Done],
      state
    );
  }

  private onVmCreationInProgress(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ],
      state
    );
  }

  private onVmCreationFinished(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.DEPLOYING_VM',
      [ProgressLoggerMessageStatus.Done],
      state
    );
  }

  private onInstanceGroupCreation(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ],
      state
    );
  }

  private onInstanceGroupCreationFinished(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.CREATING_INSTANCE_GROUP',
      [ProgressLoggerMessageStatus.Done],
      state
    );
  }

  private onTagCopying(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.TAG_COPYING',
      [
        ProgressLoggerMessageStatus.Highlighted,
        ProgressLoggerMessageStatus.InProgress
      ],
      state
    );
  }

  private onTagCopyingFinished(state: FormState): void {
    this.updateLoggerMessage(
      'VM_PAGE.VM_CREATION.TAG_COPYING',
      [ProgressLoggerMessageStatus.Done],
      state
    );
  }

  private onVmDeploymentFinished(notificationId: string): void {
    this.store.dispatch(new vmActions.VmCreationStateUpdate({ deploymentStopped: false }));
    this.notifyOnDeployDone(notificationId);
    this.store.dispatch(new vmActions.DeploymentAddLoggerMessage({
      text: 'VM_PAGE.VM_CREATION.DEPLOYMENT_FINISHED',
      status: [ProgressLoggerMessageStatus.Highlighted]
    }));
  }

  private updateLoggerMessage(
    messageText: string | ParametrizedTranslation,
    status?: Array<ProgressLoggerMessageStatus>,
    state?: FormState
  ): void {

    const updatedMessage = state.loggerStageList.find(message => {
      return message.text === messageText;
    });
    const id = updatedMessage && updatedMessage.id;
    this.store.dispatch(new vmActions.DeploymentUpdateLoggerMessage({ id, data: { status } }));
  }
}
