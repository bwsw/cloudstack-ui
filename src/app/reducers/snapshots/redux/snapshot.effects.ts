import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity/src/models';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { ISnapshotData, Snapshot, Volume } from '../../../shared/models';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SnackBarService } from '../../../core/services';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { VirtualMachine, VmState } from '../../../vm';
import { State } from '../../index';
// tslint:disable-next-line
import { SnapshotCreationComponent } from '../../../vm/vm-sidebar/storage-detail/volumes/snapshot-creation/snapshot-creation.component';
import { VirtualMachinesEffects } from '../../vm/redux/vm.effects';
import * as vmActions from '../../vm/redux/vm.actions';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromVolumes from '../../volumes/redux/volumes.reducers';
import * as snapshotActions from './snapshot.actions';


@Injectable()
export class SnapshotEffects {
  @Effect()
  loadSnapshots$: Observable<Action> = this.actions$
    .ofType(snapshotActions.LOAD_SNAPSHOT_REQUEST)
    .switchMap((action: snapshotActions.LoadSnapshotRequest) => {
      return this.snapshotService
        .getListAll(action.payload)
        .map((snapshots: Snapshot[]) => new snapshotActions.LoadSnapshotResponse(snapshots))
        .catch(() => Observable.of(new snapshotActions.LoadSnapshotResponse([])));
    });


  @Effect()
  addSnapshot$: Observable<Action> = this.actions$
    .ofType(snapshotActions.ADD_SNAPSHOT)
    .mergeMap((action: snapshotActions.AddSnapshot) => {
      return this.dialog.open(SnapshotCreationComponent, {
        data: action.payload
      })
        .afterClosed()
        .filter(res => Boolean(res))
        .flatMap((params: ISnapshotData) => {

          const notificationId = this.jobsNotificationService.add(
            'NOTIFICATIONS.SNAPSHOT.TAKE_IN_PROGRESS');

          return this.snapshotService.create(
            action.payload.id,
            params.name,
            params.desc
          )
            .do(() => {
              const message = 'NOTIFICATIONS.SNAPSHOT.TAKE_DONE';
              this.showNotificationsOnFinish(message, notificationId);
            })
            .map(newSnap => {
              return new snapshotActions.AddSnapshotSuccess(newSnap);
            })
            .catch((error) => {
              const message = 'NOTIFICATIONS.SNAPSHOT.TAKE_FAILED';
              this.showNotificationsOnFail(error, message, notificationId);
              return Observable.of(new snapshotActions.SnapshotUpdateError(error));
            });
        });
    });

  @Effect()
  deleteSnapshot$: Observable<Action> = this.actions$
    .ofType(snapshotActions.DELETE_SNAPSHOT)
    .mergeMap((action: snapshotActions.DeleteSnapshot) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
      return this.snapshotService.remove(action.payload.id)
        .do(() => {
          const message = 'NOTIFICATIONS.SNAPSHOT.DELETION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(() => {
          return new snapshotActions.DeleteSnapshotSuccess(action.payload);
        })
        .catch((error) => {
          const message = 'NOTIFICATIONS.SNAPSHOT.DELETION_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new snapshotActions.SnapshotUpdateError(error));
        });
    });

  @Effect()
  deleteSnapshots$: Observable<Action> = this.actions$
    .ofType(snapshotActions.DELETE_SNAPSHOTS)
    .mergeMap((action: snapshotActions.DeleteSnapshots) => action.payload
      .map((snapshot: Snapshot) => new snapshotActions.DeleteSnapshot(snapshot)));

  @Effect()
  revertVolumeToSnapshot$: Observable<Action> = this.actions$
    .ofType(snapshotActions.REVERT_VOLUME_TO_SNAPSHOT)
    .withLatestFrom(
      this.store.select(fromVolumes.selectEntities),
      this.store.select(fromVMs.selectEntities)
    )
    .mergeMap(([action, volumes, vms]: [
      snapshotActions.RevertVolumeToSnapshot, Dictionary<Volume>, Dictionary<VirtualMachine>
      ]) => {
      const vmId = Object.entries(volumes)
        && volumes[action.payload.volumeid]
        && volumes[action.payload.volumeid].virtualmachineid;
      const isVmRunning = Object.entries(vms).length && vms[vmId] && vms[vmId].state === VmState.Running;

      return this.dialogService.confirm({
        message: isVmRunning
          ? 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_REVERTING_WITH_VM_REBOOT'
          : 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_REVERTING'
      })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .flatMap(() => (isVmRunning
          ? this.vmEffects.stop(vms[vmId])
          : Observable.of(null))
          .flatMap(() => {
            const notificationId = this.jobsNotificationService.add(
              'NOTIFICATIONS.SNAPSHOT.REVERT_IN_PROGRESS');
            return this.snapshotService.revert(action.payload.id)
              .do(() => {
                const message = 'NOTIFICATIONS.SNAPSHOT.REVERT_DONE';
                this.showNotificationsOnFinish(message, notificationId);
              })
              .flatMap(() => {
                return isVmRunning
                  ? [
                    new snapshotActions.RevertVolumeToSnapshotSuccess(action.payload),
                    new vmActions.StartVm(vms[vmId])
                  ]
                  : [new snapshotActions.RevertVolumeToSnapshotSuccess(action.payload)];
              })
              .catch((error) => {
                const message = 'NOTIFICATIONS.SNAPSHOT.REVERT_FAILED';
                this.showNotificationsOnFail(error, message, notificationId);
                return Observable.of(new snapshotActions.SnapshotUpdateError(error))
              });
          }));
    });

  @Effect({ dispatch: false })
  deleteSnapshotSuccess$ = this.actions$
    .ofType(snapshotActions.DELETE_SNAPSHOT_SUCCESS)
    .map((action: snapshotActions.DeleteSnapshotSuccess) => action.payload)
    .filter((snapshot: Snapshot) => this.router.isActive(
      `/snapshots/${snapshot.id}`,
      false
    ))
    .do(() => this.router.navigate(['./snapshots'], {
      queryParamsHandling: 'preserve'
    }));


  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private vmEffects: VirtualMachinesEffects,
    private router: Router,
    private snackBarService: SnackBarService
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
