import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';
// tslint:disable-next-line
import { VolumeAttachmentContainerComponent } from '../../../shared/actions/volume-actions/volume-attachment/volume-attachment.container';
import { VolumeResizeContainerComponent } from '../../../shared/actions/volume-actions/volume-resize.container';
import { isRoot, Volume } from '../../../shared/models';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SnackBarService } from '../../../core/services';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';
import { VolumeResizeData, VolumeService } from '../../../shared/services/volume.service';
// tslint:disable-next-line
import { RecurringSnapshotsComponent } from '../../../snapshot/recurring-snapshots/recurring-snapshots.component';
import { State } from '../../index';
import * as volumeActions from './volumes.actions';
import * as fromVolumes from './volumes.reducers';
import * as snapshotActions from '../../snapshots/redux/snapshot.actions';
// tslint:disable-next-line
import { VolumeDeleteDialogComponent } from '../../../shared/actions/volume-actions/volume-delete/volume-delete-dialog.component';

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
    .mergeMap((action: volumeActions.CreateVolume) => {
      const notificationId = this.jobsNotificationService.add('NOTIFICATIONS.VOLUME.CREATION_IN_PROGRESS');
      return this.volumeService.create(action.payload)
        .do(() => {
          const message = 'NOTIFICATIONS.VOLUME.CREATION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(createdVolume => {
          this.dialog.closeAll();
          return new volumeActions.CreateSuccess(createdVolume);
        })
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VOLUME.CREATION_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new volumeActions.CreateError(error));
        });
    });
  @Effect()
  createVolumeFromSnapshot$: Observable<Action> = this.actions$
    .ofType(volumeActions.CREATE_VOLUME_FROM_SNAPSHOT)
    .mergeMap((action: volumeActions.CreateVolumeFromSnapshot) => {
      const notificationId = this.jobsNotificationService.add('NOTIFICATIONS.VOLUME.CREATION_IN_PROGRESS');
      return this.volumeService.createFromSnapshot(action.payload)
        .do(() => {
          const message = 'NOTIFICATIONS.VOLUME.CREATION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(job => {
          const createdVolume = job.jobresult['volume'];
          this.dialog.closeAll();
          return new volumeActions.CreateVolumeFromSnapshotSuccess(createdVolume);
        })
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VOLUME.CREATION_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new volumeActions.CreateError(error));
        });
    });

  @Effect()
  changeDescription$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_CHANGE_DESCRIPTION)
    .mergeMap((action: volumeActions.ChangeDescription) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_IN_PROGRESS');

      return (action.payload.description
        ? this.volumeTagService
          .setDescription(action.payload.volume, action.payload.description)
        : this.volumeTagService
          .removeDescription(action.payload.volume))
        .map((volume: Volume) => {
          const message = 'NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
          return new volumeActions.UpdateVolume(volume);
        })
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VOLUME.CHANGE_DESCRIPTION_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  attachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.ATTACH_VOLUME)
    .mergeMap((action: volumeActions.AttachVolume) => {
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
            'NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');

          const params = {
            id: action.payload.id,
            virtualMachineId: virtualMachineId
          };
          return this.volumeService
            .attach(params)
            .map((volume: Volume) => {
              const message = 'NOTIFICATIONS.VOLUME.ATTACHMENT_DONE';
              this.showNotificationsOnFinish(message, notificationId);
              return new volumeActions.UpdateVolume(volume);
            })
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new volumeActions.VolumeUpdateError(error));
            });
        });
    });

  @Effect()
  attachVolumeToVM$: Observable<Action> = this.actions$
    .ofType(volumeActions.ATTACH_VOLUME_TO_VM)
    .mergeMap((action: volumeActions.AttachVolumeToVM) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');

      const params = {
        id: action.payload.volumeId,
        virtualMachineId: action.payload.virtualMachineId
      };
      return this.volumeService
        .attach(params)
        .map((volume: Volume) => {
          const message = 'NOTIFICATIONS.VOLUME.ATTACHMENT_DONE';
          this.showNotificationsOnFinish(message, notificationId);
          return new volumeActions.UpdateVolume(volume);
        })
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  detachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DETACH_VOLUME)
    .mergeMap((action: volumeActions.DetachVolume) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DETACHMENT' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.VOLUME.DETACHMENT_IN_PROGRESS');
          return this.volumeService
            .detach(action.payload)
            .switchMap((volume: Volume) => {
              const message = 'NOTIFICATIONS.VOLUME.DETACHMENT_DONE';
              this.showNotificationsOnFinish(message, notificationId);
              return Observable.of(new volumeActions.ReplaceVolume(volume));
            })
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VOLUME.DETACHMENT_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new volumeActions.VolumeUpdateError(error));
            });
        });
    });

  @Effect()
  resizeVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.RESIZE_VOLUME)
    .mergeMap((action: volumeActions.ResizeVolume) => {
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
            'NOTIFICATIONS.VOLUME.RESIZE_IN_PROGRESS');
          return this.volumeService
            .resize(params)
            .map((volume: Volume) => {
              const message = 'NOTIFICATIONS.VOLUME.RESIZE_DONE';
              this.showNotificationsOnFinish(message, notificationId);
              this.dialog.closeAll();
              return new volumeActions.ResizeVolumeSuccess(volume);
            })
            .catch((error: Error) => {
              const message = 'NOTIFICATIONS.VOLUME.RESIZE_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new volumeActions.VolumeUpdateError(error));
            });
        });
    });

  @Effect({ dispatch: false })
  addSnapshotSchedule$: Observable<Action> = this.actions$
    .ofType(volumeActions.ADD_SNAPSHOT_SCHEDULE)
    .mergeMap((action: volumeActions.AddSnapshotSchedule) => {
      return this.dialog.open(RecurringSnapshotsComponent, {
        data: action.payload
      }).afterClosed();
    });

  @Effect()
  deleteVolumes$: Observable<Action> = this.actions$
    .ofType(volumeActions.DELETE_VOLUMES)
    .withLatestFrom(this.store.select(fromVolumes.selectVolumesWithSnapshots))
    .map(([action, volumes]: [volumeActions.DeleteVolumes, Array<Volume>]) => {
      return [volumes.filter((volume: Volume) => !isRoot(volume)
        && volume.virtualmachineid === action.payload.vm.id), action.payload.expunged];
    })
    .filter(([volumes, expunged]: [Array<Volume>, boolean]) => !!volumes.length)
    .switchMap(([volumes, expunged]: [Array<Volume>, boolean]) =>
      this.dialog.open(VolumeDeleteDialogComponent, {
        data: !!volumes.find(volume => !!volume.snapshots.length)
      }).afterClosed()
        .filter(res => Boolean(res))
        .flatMap((params) => {
          return volumes
            .reduce((res: Action[], volume: Volume) => {
              const detachedVolume = expunged ?
                Object.assign({}, volume, { virtualmachineid: '' }) :
                volume;
              if (params.deleteSnapshots && !!volume.snapshots.length) {
                res.push(
                  new snapshotActions.DeleteSnapshots(detachedVolume.snapshots),
                  new volumeActions.DeleteVolume(detachedVolume)
                );
              } else {
                res.push(new volumeActions.DeleteVolume(detachedVolume));
              }
              return res;
            }, []);
        }));

  @Effect()
  deleteVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DELETE_VOLUME)
    .mergeMap((action: volumeActions.DeleteVolume) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VOLUME.DELETION_IN_PROGRESS');

      const remove = (removeVolume) => {
        return this.volumeService.remove(removeVolume)
          .map(() => {
            const message = 'NOTIFICATIONS.VOLUME.DELETION_DONE';
            this.showNotificationsOnFinish(message, notificationId);
            return new volumeActions.DeleteSuccess(removeVolume);
          })
          .catch((error: Error) => {
            const message = 'NOTIFICATIONS.VOLUME.DELETION_FAILED';
            this.showNotificationsOnFail(error, message, notificationId);
            return Observable.of(new volumeActions.VolumeUpdateError(error));
          });
      };

      const detach = (detachVolume) => {
        return this.volumeService
          .detach(detachVolume)
          .map((volume: Volume) => {
            return new volumeActions.ReplaceVolume(volume);
          })
          .catch((error: Error) => {
            const message = 'NOTIFICATIONS.VOLUME.DETACHMENT_FAILED';
            this.showNotificationsOnFail(error, message, notificationId);
            return Observable.of(new volumeActions.VolumeUpdateError(error));
          });
      };

      if (action.payload.virtualmachineid) {
        return detach(action.payload)
          .filter((a: Action) => a.type === volumeActions.REPLACE_VOLUME)
          .flatMap(() => remove(action.payload));
      } else {
        return remove(action.payload);
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


  constructor(
    private actions$: Actions,
    private dialogService: DialogService,
    private volumeService: VolumeService,
    private volumeTagService: VolumeTagService,
    private router: Router,
    private snapshotService: SnapshotService,
    private snackBarService: SnackBarService,
    private jobsNotificationService: JobsNotificationService,
    private dialog: MatDialog,
    private store: Store<State>
  ) {
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
    this.dialogService.alert({ message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
