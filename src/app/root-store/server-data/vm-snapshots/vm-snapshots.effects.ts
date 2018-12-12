import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import * as fromVolumes from '../../../reducers/volumes/redux/volumes.reducers';
// tslint:disable-next-line
import { VolumeSnapshotFromVmSnapshotDialogComponent } from '../../../shared/components/volume-snapshot-from-vm-snapshot-dialog/volume-snapshot-from-vm-snapshot-dialog.component';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { VmSnapshotService } from '../../../shared/services/vm-snapshot.service';
import { VmSnapshotCreationDialogComponent } from '../../../vm/vm-sidebar/vm-detail/vm-snapshot-creation-dialog/vm-snapshot-creation-dialog.component';
import { State } from '../../state';
import {
  Create,
  CreateCanceled,
  CreateConfirmed,
  CreateError,
  CreateSuccess,
  CreateVolumeSnapshot,
  CreateVolumeSnapshotCanceled,
  CreateVolumeSnapshotConfirmed,
  CreateVolumeSnapshotError,
  CreateVolumeSnapshotSuccess,
  Delete,
  DeleteCanceled,
  DeleteConfirmed,
  DeleteError,
  DeleteSuccess,
  Load,
  LoadError,
  LoadSuccess,
  Revert,
  RevertCanceled,
  RevertConfirmed,
  RevertError,
  RevertSuccess,
  VmSnapshotActionTypes,
} from './vm-snapshots.actions';
import * as vmSnapshotSelectors from './vm-snapshots.selectors';

@Injectable()
export class VmSnapshotsEffects {
  @Effect()
  loadVmSnapshots$: Observable<Action> = this.actions$.pipe(
    ofType<Load>(VmSnapshotActionTypes.Load),
    switchMap(() =>
      this.vmSnapshotsService.getList().pipe(
        map(snapshots => new LoadSuccess({ snapshots })),
        catchError(error => of(new LoadError({ error }))),
      ),
    ),
  );

  @Effect()
  createVmSnapshotDialog$: Observable<Action> = this.actions$.pipe(
    ofType<Create>(VmSnapshotActionTypes.Create),
    exhaustMap(action =>
      this.matDialog
        .open(VmSnapshotCreationDialogComponent, { width: '400px', disableClose: true })
        .afterClosed()
        .pipe(
          map(result => {
            if (result) {
              return new CreateConfirmed({
                vmId: action.payload.vmId,
                name: result.name,
                description: result.description,
                snapshotMemory: result.snapshotMemory,
              });
            }
            return new CreateCanceled();
          }),
        ),
    ),
  );

  @Effect()
  createVmSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType<CreateConfirmed>(VmSnapshotActionTypes.CreateConfirmed),
    map(action => action.payload),
    mergeMap(payload => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM_SNAPSHOTS.TAKE_VM_SNAP_IN_PROGRESS',
      );
      const params = {
        virtualmachineid: payload.vmId,
        description: payload.description,
        name: payload.name,
        snapshotmemory: payload.snapshotMemory,
      };
      return this.vmSnapshotsService.create(params).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.TAKE_VM_SNAP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vmSnapshot => new CreateSuccess({ vmSnapshot })),
        catchError(error => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.TAKE_VM_SNAP_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new CreateError({ error }));
        }),
      );
    }),
  );

  @Effect()
  createVolumeSnapshotFromVmSnapshotDialog$: Observable<Action> = this.actions$.pipe(
    ofType<CreateVolumeSnapshot>(VmSnapshotActionTypes.CreateVolumeSnapshot),
    withLatestFrom(
      this.store.pipe(select(vmSnapshotSelectors.selectEntities)),
      this.store.pipe(select(fromVolumes.selectAll)),
    ),
    map(([action, vmSnapshotEntities, volumes]) => {
      const snapshotId = action.payload.snapshotId;
      const vmId = vmSnapshotEntities[snapshotId].virtualmachineid;
      const vmVolumes = volumes.filter(volume => volume.virtualmachineid === vmId);
      return {
        snapshotId,
        volumes: vmVolumes,
      };
    }),
    exhaustMap(({ snapshotId, volumes }) => {
      return this.matDialog
        .open(VolumeSnapshotFromVmSnapshotDialogComponent, { width: '350px', data: { volumes } })
        .afterClosed()
        .pipe(
          map(result => {
            if (result) {
              return new CreateVolumeSnapshotConfirmed({
                vmsnapshotid: snapshotId,
                volumeid: result.volumeId,
                name: result.name,
              });
            }
            return new CreateVolumeSnapshotCanceled();
          }),
        );
    }),
  );

  @Effect()
  createVolumeSnapshotFromVmSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType<CreateVolumeSnapshotConfirmed>(VmSnapshotActionTypes.CreateVolumeSnapshotConfirmed),
    mergeMap(action => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM_SNAPSHOTS.TAKE_SNAP_FROM_VM_SNAP_IN_PROGRESS',
      );
      return this.vmSnapshotsService.createSnapshotFromVMSnapshot(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.TAKE_SNAP_FROM_VM_SNAP_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        // todo it returns snapshot need to update
        map(() => new CreateVolumeSnapshotSuccess({ todo: '' })),
        catchError(error => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.TAKE_SNAP_FROM_VM_SNAP_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new CreateVolumeSnapshotError({ error }));
        }),
      );
    }),
  );

  @Effect()
  deleteConfirmation$: Observable<Action> = this.actions$.pipe(
    ofType<Delete>(VmSnapshotActionTypes.Delete),
    exhaustMap(action => {
      const message = 'DIALOG_MESSAGES.VM_SNAPSHOT.CONFIRM_DELETION';
      return this.dialogService.confirm({ message }).pipe(
        map(confirmed => {
          if (confirmed) {
            return new DeleteConfirmed({ id: action.payload.id });
          }
          return new DeleteCanceled();
        }),
      );
    }),
  );

  @Effect()
  deleteVmSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteConfirmed>(VmSnapshotActionTypes.DeleteConfirmed),
    mergeMap(action => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM_SNAPSHOTS.DELETION_IN_PROGRESS',
      );
      return this.vmSnapshotsService.delete(action.payload.id).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.DELETION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(id => new DeleteSuccess({ id })),
        catchError(error => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.DELETION_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new DeleteError({ error }));
        }),
      );
    }),
  );

  @Effect()
  revertConfirmation$: Observable<Action> = this.actions$.pipe(
    ofType<Revert>(VmSnapshotActionTypes.Revert),
    exhaustMap(action => {
      const message = 'DIALOG_MESSAGES.VM_SNAPSHOT.CONFIRM_REVERTING';
      return this.dialogService.confirm({ message }).pipe(
        map(confirmed => {
          if (confirmed) {
            return new RevertConfirmed({ id: action.payload.id });
          }
          return new RevertCanceled();
        }),
      );
    }),
  );

  @Effect()
  revert$: Observable<Action> = this.actions$.pipe(
    ofType<RevertConfirmed>(VmSnapshotActionTypes.RevertConfirmed),
    mergeMap(action => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.VM_SNAPSHOTS.REVERT_IN_PROGRESS',
      );
      return this.vmSnapshotsService.revert(action.payload.id).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.REVERT_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(vm => new RevertSuccess({ vm })),
        catchError(error => {
          const message = 'NOTIFICATIONS.VM_SNAPSHOTS.REVERT_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new RevertError({ error }));
        }),
      );
    }),
  );

  constructor(
    private actions$: Actions,
    private vmSnapshotsService: VmSnapshotService,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private snackBarService: SnackBarService,
    private matDialog: MatDialog,
    private store: Store<State>,
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
