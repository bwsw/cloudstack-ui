import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Snapshot } from '../../../shared/models';
import { ISnapshotData } from '../../../shared/models/volume.model';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
// tslint:disable-next-line
import { SnapshotCreationComponent } from '../../../vm/vm-sidebar/storage-detail/volumes/snapshot-creation/snapshot-creation.component';

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
    .switchMap((action: snapshotActions.AddSnapshot) => {
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
            .map(newSnap => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_DONE'
              });
              return new snapshotActions.AddSnapshotSuccess(newSnap);
            })
            .catch((error) => {
              this.jobsNotificationService.fail({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_FAILED'
              });
              return Observable.of(new snapshotActions.SnapshotUpdateError(error));
            });
        });
    });

  @Effect()
  deleteSnapshot$: Observable<Action> = this.actions$
    .ofType(snapshotActions.DELETE_SNAPSHOT)
    .flatMap((action: snapshotActions.DeleteSnapshot) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
      return this.snapshotService.remove(action.payload.id)
        .map(() => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_DONE'
          });
          return new snapshotActions.DeleteSnapshotSuccess(action.payload);
        })
        .catch((error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_FAILED'
          });
          return Observable.of(new snapshotActions.SnapshotUpdateError(error));
        });
    });

  @Effect()
  deleteSnapshots$: Observable<Action> = this.actions$
    .ofType(snapshotActions.DELETE_SNAPSHOTS)
    .flatMap((action: snapshotActions.DeleteSnapshots) => action.payload
      .map((snapshot: Snapshot) => new snapshotActions.DeleteSnapshot(snapshot)));

  @Effect({ dispatch: false })
  handleError$ = this.actions$
    .ofType(snapshotActions.SNAPSHOT_UPDATE_ERROR)
    .do((action: snapshotActions.SnapshotUpdateError) => {
      this.dialogService.alert({
        message:action.payload.message
      });
    });


  constructor(
    private actions$: Actions,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {
  }
}
