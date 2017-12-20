import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { VolumeAttachmentContainerComponent } from '../../../shared/actions/volume-actions/volume-attachment/volume-attachment.container';
import { VolumeResizeContainerComponent } from '../../../shared/actions/volume-actions/volume-resize.container';
import { ISnapshotData, Volume } from '../../../shared/models/volume.model';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';
import { VolumeResizeData, VolumeService } from '../../../shared/services/volume.service';
import { RecurringSnapshotsComponent } from '../../../snapshot/recurring-snapshots/recurring-snapshots.component';
import { SnapshotCreationComponent } from '../../../vm/vm-sidebar/storage-detail/volumes/snapshot-creation/snapshot-creation.component';
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
        .map(volume => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_DONE'
          });
          return new volumeActions.UpdateVolume(new Volume(volume));
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
          zoneId: action.payload.zoneId
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
            .map(volume => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE'
              });
              return new volumeActions.UpdateVolume(new Volume(volume))
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
        .map(volume => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE'
          });
          return new volumeActions.UpdateVolume(new Volume(volume))
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
            .switchMap(volume => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
              });
              return Observable.of(new volumeActions.ReplaceVolume(new Volume(volume)));
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
            .map(volume => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VOLUME.RESIZE_DONE'
              });
              this.dialog.closeAll();
              return new volumeActions.ResizeVolumeSuccess(new Volume(volume));
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

  @Effect()
  addSnapshot$: Observable<Action> = this.actions$
    .ofType(volumeActions.ADD_SNAPSHOT)
    .switchMap((action: volumeActions.AddSnapshot) => {
      return this.dialog.open(SnapshotCreationComponent, {
        data: action.payload
      })
        .afterClosed()
        .filter(res => Boolean(res))
        .switchMap((params: ISnapshotData) => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_IN_PROGRESS');

          return this.snapshotService.create(
            action.payload.id,
            params.name,
            params.desc
          )
            .map(snapshot => {
              const newSnaps = Object.assign([], action.payload.snapshots);

              newSnaps.unshift(snapshot);
              const newVolume = Object.assign(
                {},
                action.payload,
                { snapshots: newSnaps }
              );
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_DONE'
              });
              return new volumeActions.AddSnapshotSuccess(new Volume(newVolume));
            })
            .catch((error: Error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_FAILED'
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
      })
        .afterClosed();
    });

  @Effect()
  deleteSnapshot$: Observable<Action> = this.actions$
    .ofType(volumeActions.DELETE_SNAPSHOT)
    .switchMap((action: volumeActions.DeleteSnapshot) => {

      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
          return this.snapshotService.remove(action.payload.snapshot.id)
            .map(() => {
              const newSnapshots = action.payload.volume.snapshots.filter(
                _ => _.id !== action.payload.snapshot.id);
              const newVolume = Object.assign({}, action.payload.volume, {snapshots: newSnapshots});
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_DONE'
              });
              return new volumeActions.DeleteSnapshotSuccess(new Volume(newVolume));
            })
            .catch(error => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_FAILED'
              });

              return Observable.throw(error);
            });
        });
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
              .do(volume => {
                this.jobsNotificationService.finish({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
                });
                return Observable.of(new volumeActions.ReplaceVolume(new Volume(volume)));
              })
              .catch((error: Error) => {
                this.jobsNotificationService.fail({
                  id: notificationId,
                  message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_FAILED'
                });
                return Observable.of(new volumeActions.VolumeUpdateError(error));
              });
          };

          if (action.payload.virtualMachineId) {
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
