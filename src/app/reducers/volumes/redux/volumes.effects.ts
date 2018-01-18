import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
// tslint:disable-next-line
import { VolumeAttachmentContainerComponent } from '../../../shared/actions/volume-actions/volume-attachment/volume-attachment.container';
import { VolumeResizeContainerComponent } from '../../../shared/actions/volume-actions/volume-resize.container';
import { Volume } from '../../../shared/models/volume.model';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';
import { VolumeResizeData, VolumeService } from '../../../shared/services/volume.service';
// tslint:disable-next-line
import { RecurringSnapshotsComponent } from '../../../snapshot/recurring-snapshots/recurring-snapshots.component';

import * as volumeActions from './volumes.actions';

@Injectable()
export class VolumesEffects {
  @Effect()
  loadVolumes$: Observable<Action> = this.actions$
    .ofType(volumeActions.LOAD_VOLUMES_REQUEST)
    .switchMap((action: volumeActions.LoadVolumesRequest) => {
      return this.volumeService.getList(action.payload)
        .map((volumes: Volume[]) => {
          return new volumeActions.LoadVolumesResponse(volumes);
        })
        .catch(() => Observable.of(new volumeActions.LoadVolumesResponse([])));
    });

  @Effect()
  createVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.CREATE_VOLUME)
    .switchMap((action: volumeActions.CreateVolume) => {
      return this.volumeService.create(action.payload)
        .map(createdVolume => {
          this.dialog.closeAll();
          return new volumeActions.CreateSuccess(createdVolume);
        })
        .catch((error: Error) => {
          return Observable.of(new volumeActions.CreateError(error));
        });
    });

  @Effect()
  changeDescription$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_CHANGE_DESCRIPTION)
    .switchMap((action: volumeActions.ChangeDescription) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_IN_PROGRESS');

      return (action.payload.description
        ? this.volumeTagService
          .setDescription(action.payload.volume, action.payload.description)
        : this.volumeTagService
          .removeDescription(action.payload.volume))
        .map((volume: Volume) => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_DONE'
          });
          return new volumeActions.UpdateVolume(volume);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_FAILED'
          });
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  attachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.ATTACH_VOLUME)
    .switchMap((action: volumeActions.AttachVolume) => {
      return this.dialog.open(VolumeAttachmentContainerComponent, {
        data: {
          volume: action.payload,
          zoneId: action.payload.zoneid
        },
        width: '375px'
      })
      .afterClosed()
      .filter(res => Boolean(res))
      .switchMap((virtualMachineId) => {
        const notificationId = this.jobsNotificationService.add(
          'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');

        const params = {
          id: action.payload.id,
          virtualMachineId: virtualMachineId
        };
        return this.volumeService
          .attach(params)
          .map((volume: Volume) => {
            this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE'
            });
            return new volumeActions.UpdateVolume(volume)
          })
          .catch((error: Error) => {
            this.jobsNotificationService.fail({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED'
            });
            return Observable.of(new volumeActions.VolumeUpdateError(error));
          });
        });
    });

  @Effect()
  attachVolumeToVM$: Observable<Action> = this.actions$
    .ofType(volumeActions.ATTACH_VOLUME_TO_VM)
    .switchMap((action: volumeActions.AttachVolumeToVM) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');

      const params = {
        id: action.payload.volumeId,
        virtualMachineId: action.payload.virtualMachineId
      };
      return this.volumeService
        .attach(params)
        .map((volume: Volume) => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE'
          });
          return new volumeActions.UpdateVolume(volume)
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED'
          });
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  detachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DETACH_VOLUME)
    .switchMap((action: volumeActions.DetachVolume) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DETACHMENT' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_IN_PROGRESS');
          return this.volumeService
            .detach(action.payload)
            .switchMap((volume: Volume) => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
              });
              return Observable.of(new volumeActions.ReplaceVolume(volume));
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_FAILED'
              });
              return Observable.of(new volumeActions.VolumeUpdateError(error));
            });
        });
    });

  @Effect()
  resizeVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.RESIZE_VOLUME)
    .switchMap((action: volumeActions.ResizeVolume) => {
      return this.dialog.open(VolumeResizeContainerComponent, {
        data: {
          volume: action.payload
        },
        width: '375px'
      })
      .afterClosed()
      .filter(res => Boolean(res))
      .switchMap((params: VolumeResizeData) => {
        const notificationId = this.jobsNotificationService.add(
          'JOB_NOTIFICATIONS.VOLUME.RESIZE_IN_PROGRESS');
        return this.volumeService
          .resize(params)
          .map((volume: Volume) => {
            this.jobsNotificationService.finish({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VOLUME.RESIZE_DONE'
            });
            this.dialog.closeAll();
            return new volumeActions.ResizeVolumeSuccess(volume);
          })
          .catch((error: Error) => {
            this.jobsNotificationService.fail({
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VOLUME.RESIZE_FAILED'
            });
            return Observable.of(new volumeActions.VolumeUpdateError(error));
          });
        });
    });

  @Effect({ dispatch: false })
  addSnapshotSchedule$: Observable<Action> = this.actions$
    .ofType(volumeActions.ADD_SNAPSHOT_SCHEDULE)
    .switchMap((action: volumeActions.AddSnapshotSchedule) => {
      return this.dialog.open(RecurringSnapshotsComponent, {
        data: action.payload
      }).afterClosed();
    });

  @Effect()
  deleteVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DELETE_VOLUME)
    .switchMap((action: volumeActions.DeleteVolume) => {
      return this.dialogService.confirm({
        message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DELETION'
      })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.VOLUME.DELETION_IN_PROGRESS');

          const remove = (removeVolume) => {
            return this.volumeService.remove(removeVolume)
              .map(() => {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_DONE'
                });
                return new volumeActions.DeleteSuccess(removeVolume);
              })
              .catch((error: Error) => {
                this.jobsNotificationService.fail({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_FAILED'
                });
                return Observable.of(new volumeActions.VolumeUpdateError(error));
              });
          };

          const detach = (detachVolume) => {
            return this.volumeService
              .detach(detachVolume)
              .do((volume: Volume) => {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
                });
                return Observable.of(new volumeActions.ReplaceVolume(volume));
              })
              .catch((error: Error) => {
                this.jobsNotificationService.fail({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_FAILED'
                });
                return Observable.of(new volumeActions.VolumeUpdateError(error));
              });
          };

          if (action.payload.virtualmachineid) {
            return detach(action.payload)
              .switchMap(() => remove(action.payload));
          } else {
            return remove(action.payload);
          }
        });
    });

  @Effect({ dispatch: false })
  deleteVolumeSuccessNavigate$: Observable<Volume> = this.actions$
    .ofType(volumeActions.VOLUME_DELETE_SUCCESS)
    .map((action: volumeActions.DeleteSuccess) => action.payload)
    .filter((volume: Volume) => {
      return this.router.isActive(`/storage/${volume.id}`, false);
    })
    .do(() => {
      this.router.navigate(['./storage'], {
        queryParamsHandling: 'preserve'
      });
    });

  @Effect({ dispatch: false })
  createError$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_CREATE_ERROR)
    .do((action: volumeActions.CreateError) => {
      this.handleError(action.payload);
    });

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_UPDATE_ERROR)
    .do((action: volumeActions.VolumeUpdateError) => {
      this.handleError(action.payload);
    });

  constructor(
    private actions$: Actions,
    private dialogService: DialogService,
    private volumeService: VolumeService,
    private volumeTagService: VolumeTagService,
    private router: Router,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private dialog: MatDialog
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
