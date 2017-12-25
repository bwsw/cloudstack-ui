import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Snapshot } from '../../../shared/models';
import { Volume } from '../../../shared/models/volume.model';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';

import * as snapshot from './snapshot.actions';


@Injectable()
export class SnapshotEffects {
  @Effect()
  loadSnapshots$: Observable<Action> = this.actions$
    .ofType(snapshot.LOAD_SNAPSHOT_REQUEST)
    .switchMap((action: snapshot.LoadSnapshotRequest) => {
      return this.snapshotService
        .getListAll(action.payload)
        .map((snapshots: Snapshot[]) => new snapshot.LoadSnapshotResponse(snapshots))
        .catch(() => Observable.of(new snapshot.LoadSnapshotResponse([])));
    });


  @Effect()
  addSnapshot$: Observable<Action> = this.actions$
    .ofType(snapshot.ADD_SNAPSHOT)
    .switchMap((action: snapshot.AddSnapshot) => {
      const notificationId = this.jobsNotificationService.add(
        'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_IN_PROGRESS');

      return this.snapshotService.create(
        action.payload.volume.id,
        action.payload.name,
        action.payload.description
      )
        .map(newSnap => {
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_DONE'
          });
          return new snapshot.AddSnapshotSuccess(newSnap);
        })
        .catch((error: Error) => {
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.TAKE_FAILED'
          });
          return Observable.of(new snapshot.SnapshotUpdateError(error));
        });
    });

  @Effect()
  deleteSnapshot$: Observable<Action> = this.actions$
    .ofType(snapshot.DELETE_SNAPSHOT)
    .switchMap((action: snapshot.DeleteSnapshot) => {

      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          const notificationId = this.jobsNotificationService.add(
            'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
          return this.snapshotService.remove(action.payload.id)
            .map(() => {
              this.jobsNotificationService.finish({
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_DONE'
              });

              return new snapshot.DeleteSnapshotSuccess(action.payload);
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

  constructor(
    private actions$: Actions,
    private snapshotService: SnapshotService,
    private jobsNotificationService: JobsNotificationService,
    private dialogService: DialogService
  ) {
  }
}
