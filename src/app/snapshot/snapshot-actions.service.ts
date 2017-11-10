import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { DialogService } from '../dialog/dialog-service/dialog.service';
import { ActionsService } from '../shared/interfaces/action-service.interface';
import { Action } from '../shared/interfaces/action.interface';
import {
  Snapshot,
  Volume
} from '../shared/models';
import { JobsNotificationService } from '../shared/services/jobs-notification.service';
import { NotificationService } from '../shared/services/notification.service';
import { SnapshotService } from '../shared/services/snapshot.service';
import { StatsUpdateService } from '../shared/services/stats-update.service';
import { TemplateCreationComponent } from '../template/template-creation/template-creation.component';


export interface SnapshotAction extends Action<Snapshot> {
  name: string;
  icon: string;
  activate(snapshot: Snapshot, volume?: Volume): Observable<void>;
}

@Injectable()
export class SnapshotActionsService implements ActionsService<Snapshot, SnapshotAction> {
  public actions: Array<SnapshotAction> = [
    {
      name: 'VM_PAGE.STORAGE_DETAILS.SNAPSHOT_ACTIONS.CREATE_TEMPLATE',
      icon: 'add',
      activate: (snapshot, volume) => this.showCreationDialog(snapshot),
      canActivate: (snapshot) => true,
      hidden: (snapshot) => false
    },
    {
      name: 'COMMON.DELETE',
      icon: 'delete',
      activate: (snapshot, volume) => this.handleSnapshotDelete(snapshot, volume),
      canActivate: (snapshot) => true,
      hidden: (snapshot) => false
    },
  ];

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private jobNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private snapshotService: SnapshotService,
    private statsUpdateService: StatsUpdateService
  ) { }

  public showCreationDialog(snapshot: Snapshot): Observable<void> {
    return this.dialog.open(TemplateCreationComponent, {
      width: '330px',
      panelClass: 'template-creation-dialog-snapshot',
      data: {
        mode: 'Template',
        snapshot
      }
    })
      .afterClosed();
  }

  public handleSnapshotDelete(snapshot: Snapshot, volume): Observable<void> {
    let notificationId: string;

    return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
      .switchMap(() => {
        notificationId = this.jobNotificationService.add('JOB_NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
        return this.snapshotService.remove(snapshot.id);
      })
      .map(() => {
        this.statsUpdateService.next();
        volume.snapshots = volume.snapshots.filter(_ => _.id !== snapshot.id);
        this.jobNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_DONE'
        });

        this.snapshotService.onSnapshotDeleted.next(snapshot);
        return Observable.of(null);
      })
      .catch(error => {
        this.notificationService.error(error);
        this.jobNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_FAILED'
        });

        return Observable.throw(error);
      });
  }
}
