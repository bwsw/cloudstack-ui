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
import { TemplateCreationContainerComponent } from '../template/template-creation/containers/template-creation.container';
import { TemplateResourceType } from '../template/shared/base-template.service';


export interface SnapshotAction extends Action<Snapshot> {
  name: string;
  icon: string;
  command: string;
  activate(snapshot: Snapshot, volume?: Volume): Observable<void>;
}

@Injectable()
export class SnapshotActionsService implements ActionsService<Snapshot, SnapshotAction> {
  public actions: Array<SnapshotAction> = [
    {
      name: 'VM_PAGE.STORAGE_DETAILS.SNAPSHOT_ACTIONS.CREATE_TEMPLATE',
      icon: 'add',
      command: 'add',
      activate: (snapshot, volume) => this.showCreationDialog(snapshot),
      canActivate: (snapshot) => true,
      hidden: (snapshot) => false
    },
    {
      name: 'COMMON.DELETE',
      icon: 'delete',
      command: 'delete',
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

  public showCreationDialog(snapshot: Snapshot): Observable<any> {
    return this.dialog.open(TemplateCreationContainerComponent, {
      width: '720px',
      panelClass: 'template-creation-dialog-snapshot',
      data: {
        mode: TemplateResourceType.template,
        snapshot
      }
    })
      .afterClosed();
  }

  public handleSnapshotDelete(snapshot: Snapshot, volume): Observable<Volume> {
    let notificationId: string;

    return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
      .filter(res => Boolean(res))
      .switchMap(() => {
        notificationId = this.jobNotificationService.add(
          'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
        return this.snapshotService.remove(snapshot.id);
      })
      .map(() => {
        this.statsUpdateService.next();
        let newSnapshots = volume.snapshots.filter(_ => _.id !== snapshot.id);
        let newVolume = Object.assign({}, volume, { snapshots: newSnapshots });
        this.jobNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_DONE'
        });
        return newVolume;
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
