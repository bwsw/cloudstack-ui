import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as volumeActions from './volumes.actions';
import { Action } from '@ngrx/store';
import { VolumeService } from '../../../shared/services/volume.service';
import { Volume } from '../../../shared/models/volume.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';
import { Utils } from '../../../shared/services/utils/utils.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';

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
        .map(createdVolume => new volumeActions.CreateSuccess(createdVolume))
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
        .map(volume => new volumeActions.UpdateVolume(new Volume(volume), {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_FAILED'
          }));
        });
    });


  @Effect()
  attachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.ATTACH_VOLUME)
    .switchMap((action: volumeActions.AttachVolume) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');

      const params = {
        id: action.payload.volumeId,
        virtualMachineId: action.payload.virtualMachineId
      };
      return this.volumeService
        .attach(params)
        .map(volume => new volumeActions.UpdateVolume(new Volume(volume), {
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE'
        }))
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED'
          }));
        });
    });

  @Effect()
  detachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DETACH_VOLUME)
    .switchMap((action: volumeActions.DetachVolume) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_IN_PROGRESS');

      const virtualMachineId = action.payload.virtualMachineId;
      return this.volumeService
        .detach(action.payload)
        .switchMap(volume => {
          return Observable.of(
            new volumeActions.ReplaceVolume(new Volume(volume), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
            }),
            new volumeActions.VolumeFilterUpdate({ virtualMachineId })
          );
        })
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_FAILED'
          }));
        });
    });

  @Effect()
  resizeVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.RESIZE_VOLUME)
    .switchMap((action: volumeActions.ResizeVolume) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VOLUME.RESIZE_IN_PROGRESS');
      return this.volumeService
        .resize(action.payload)
        .map(volume => {
          return new volumeActions.UpdateVolume(new Volume(volume), {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.RESIZE_DONE'
          });
        })
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.RESIZE_FAILED'
          }));
        });
    });

  @Effect()
  addSnapshot$: Observable<Action> = this.actions$
    .ofType(volumeActions.ADD_SNAPSHOT)
    .switchMap((action: volumeActions.AddSnapshot) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_IN_PROGRESS');

      return this.snapshotService.create(
        action.payload.volume.id,
        action.payload.name,
        action.payload.description
      )
        .map(snapshot => {
          const newSnaps = Object.assign([], action.payload.volume.snapshots);

          newSnaps.unshift(snapshot);
          const newVolume = Object.assign(
            {},
            action.payload.volume,
            { snapshots: newSnaps }
          );
          return new volumeActions.UpdateVolume(new Volume(newVolume), {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_DONE'
          });
        })
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_FAILED'
          }));
        });
    });

  @Effect()
  deleteVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DELETE_VOLUME)
    .switchMap((action: volumeActions.DeleteVolume) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.VOLUME.DELETION_IN_PROGRESS');

      const remove = (removeAction) => {
        return this.volumeService.remove(removeAction.payload)
          .map(() => new volumeActions.DeleteSuccess(removeAction.payload, {
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_DONE'
          }))
          .catch((error: Error) => {
            return Observable.of(new volumeActions.VolumeUpdateError(error, {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_FAILED'
            }));
          });
      };

      const detach = (detachAction) => {
        const virtualMachineId = detachAction.payload.virtualMachineId;
        return this.volumeService
          .detach(detachAction.payload)
          .do(volume => {
            return Observable.of(
              new volumeActions.ReplaceVolume(new Volume(volume), {
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_DONE'
              }),
              new volumeActions.VolumeFilterUpdate({ virtualMachineId })
            );
          })
          .catch((error: Error) => {
            return Observable.of(new volumeActions.VolumeUpdateError(error, {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VOLUME.DETACHMENT_FAILED'
            }));
          });
      };

      if (action.payload.virtualMachineId) {
        return detach(action)
          .switchMap(() => remove(action));
      } else {
        return remove(action);
      }
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
  updateVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.UPDATE_VOLUME, volumeActions.REPLACE_VOLUME)
    .do((action: volumeActions.UpdateVolume | volumeActions.ReplaceVolume) => {
      if (action.notification) {
        this.jobsNotificationService.finish(action.notification);
      }
    });


  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_UPDATE_ERROR)
    .do((action: volumeActions.VolumeUpdateError) => {
      this.jobsNotificationService.fail(action.notification);
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
