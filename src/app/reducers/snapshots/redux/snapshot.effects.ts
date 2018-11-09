import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  onErrorResumeNext,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { SnapshotData, Snapshot, Volume } from '../../../shared/models';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { NgrxEntities } from '../../../shared/interfaces';
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
  loadSnapshots$: Observable<Action> = this.actions$.pipe(
    ofType(snapshotActions.LOAD_SNAPSHOT_REQUEST),
    switchMap((action: snapshotActions.LoadSnapshotRequest) => {
      return this.snapshotService.getListAll(action.payload).pipe(
        map((snapshots: Snapshot[]) => new snapshotActions.LoadSnapshotResponse(snapshots)),
        catchError(() => of(new snapshotActions.LoadSnapshotResponse([]))),
      );
    }),
  );

  @Effect()
  addSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType(snapshotActions.ADD_SNAPSHOT),
    mergeMap((action: snapshotActions.AddSnapshot) => {
      return this.dialog
        .open(SnapshotCreationComponent, {
          data: action.payload,
        })
        .afterClosed()
        .pipe(
          filter(Boolean),
          mergeMap((params: SnapshotData) => {
            const notificationId = this.jobsNotificationService.add(
              'NOTIFICATIONS.SNAPSHOT.TAKE_IN_PROGRESS',
            );

            return this.snapshotService.create(action.payload.id, params.name, params.desc).pipe(
              tap(() => {
                const message = 'NOTIFICATIONS.SNAPSHOT.TAKE_DONE';
                this.showNotificationsOnFinish(message, notificationId);
              }),
              map(newSnap => {
                return new snapshotActions.AddSnapshotSuccess(newSnap);
              }),
              catchError(error => {
                const message = 'NOTIFICATIONS.SNAPSHOT.TAKE_FAILED';
                this.dialogService.showNotificationsOnFail(error, message, notificationId);
                return of(new snapshotActions.SnapshotUpdateError(error));
              }),
            );
          }),
        );
    }),
  );

  @Effect()
  deleteSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType(snapshotActions.DELETE_SNAPSHOT),
    mergeMap((action: snapshotActions.DeleteSnapshot) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS',
      );
      return this.snapshotService.remove(action.payload.id).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.SNAPSHOT.DELETION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(() => {
          return new snapshotActions.DeleteSnapshotSuccess(action.payload);
        }),
        catchError(error => {
          const message = 'NOTIFICATIONS.SNAPSHOT.DELETION_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new snapshotActions.SnapshotUpdateError(error));
        }),
      );
    }),
  );

  @Effect()
  deleteSnapshots$: Observable<Action> = this.actions$.pipe(
    ofType(snapshotActions.DELETE_SNAPSHOTS),
    mergeMap((action: snapshotActions.DeleteSnapshots) =>
      action.payload.map((snapshot: Snapshot) => new snapshotActions.DeleteSnapshot(snapshot)),
    ),
  );

  @Effect()
  revertVolumeToSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType(snapshotActions.REVERT_VOLUME_TO_SNAPSHOT),
    withLatestFrom(
      this.store.pipe(select(fromVolumes.selectEntities)),
      this.store.pipe(select(fromVMs.selectEntities)),
    ),
    mergeMap(
      ([action, volumes, vms]: [
        snapshotActions.RevertVolumeToSnapshot,
        NgrxEntities<Volume>,
        NgrxEntities<VirtualMachine>
      ]) => {
        const vmId =
          Object.entries(volumes) &&
          volumes[action.payload.volumeid] &&
          volumes[action.payload.volumeid].virtualmachineid;
        const isVmRunning =
          Object.entries(vms).length && vms[vmId] && vms[vmId].state === VmState.Running;

        return this.dialogService
          .confirm({
            message: isVmRunning
              ? 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_REVERTING_WITH_VM_REBOOT'
              : 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_REVERTING',
          })
          .pipe(
            onErrorResumeNext(),
            filter(Boolean),
            mergeMap(() =>
              (isVmRunning ? this.vmEffects.stop(vms[vmId]) : of(null)).pipe(
                mergeMap(() => {
                  const notificationId = this.jobsNotificationService.add(
                    'NOTIFICATIONS.SNAPSHOT.REVERT_IN_PROGRESS',
                  );
                  return this.snapshotService.revert(action.payload.id).pipe(
                    tap(() => {
                      const message = 'NOTIFICATIONS.SNAPSHOT.REVERT_DONE';
                      this.showNotificationsOnFinish(message, notificationId);
                    }),
                    mergeMap(() => {
                      return isVmRunning
                        ? [
                            new snapshotActions.RevertVolumeToSnapshotSuccess(action.payload),
                            new vmActions.StartVm(vms[vmId]),
                          ]
                        : [new snapshotActions.RevertVolumeToSnapshotSuccess(action.payload)];
                    }),
                    catchError(error => {
                      const message = 'NOTIFICATIONS.SNAPSHOT.REVERT_FAILED';
                      this.dialogService.showNotificationsOnFail(error, message, notificationId);
                      return of(new snapshotActions.SnapshotUpdateError(error));
                    }),
                  );
                }),
              ),
            ),
          );
      },
    ),
  );

  @Effect({ dispatch: false })
  deleteSnapshotSuccess$ = this.actions$.pipe(
    ofType(snapshotActions.DELETE_SNAPSHOT_SUCCESS),
    map((action: snapshotActions.DeleteSnapshotSuccess) => action.payload),
    filter((snapshot: Snapshot) => this.router.isActive(`/snapshots/${snapshot.id}`, false)),
    tap(() =>
      this.router.navigate(['./snapshots'], {
        queryParamsHandling: 'preserve',
      }),
    ),
  );

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private vmEffects: VirtualMachinesEffects,
    private router: Router,
    private snackBarService: SnackBarService,
  ) {}

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
