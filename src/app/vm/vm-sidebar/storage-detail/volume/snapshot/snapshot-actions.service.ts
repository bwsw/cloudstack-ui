import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';

import { DialogService } from '../../../../../dialog/dialog-service/dialog.service';
import { TemplateCreationComponent } from '../../../../../template/template-creation/template-creation.component';
import { Snapshot, Volume } from '../../../../../shared/models';
import { JobsNotificationService } from '../../../../../shared/services/jobs-notification.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { SnapshotService } from '../../../../../shared/services/snapshot.service';
import { StatsUpdateService } from '../../../../../shared/services/stats-update.service';
import { Action } from '../../../../../shared/interfaces/action.interface';
import { ActionsService } from '../../../../../shared/interfaces/action-service.interface';
import { Observable } from 'rxjs';


export interface SnapshotAction extends Action<Snapshot> {
  name: string;
  icon: string;
  activate(snapshot: Snapshot, volume?: Volume): void;
}

@Injectable()
export class SnapshotActionsService implements ActionsService<Snapshot, SnapshotAction> {
  public actions: Array<SnapshotAction> = [
    {
      name: 'VM_PAGE.STORAGE_DETAILS.SNAPSHOT_ACTIONS.CREATE_TEMPLATE',
      icon: 'add',
      activate: (snapshot) => this.showCreationDialog(snapshot)
    },
    {
      name: 'COMMON.DELETE',
      icon: 'delete',
      activate: (snapshot, volume) => this.handleSnapshotDelete(snapshot, volume)
    },
  ];

  constructor(
    private dialog: MdDialog,
    private dialogService: DialogService,
    private jobNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private snapshotService: SnapshotService,
    private statsUpdateService: StatsUpdateService
  ) { }

  public showCreationDialog(snapshot: Snapshot): void {
    this.dialog.open(TemplateCreationComponent, {
      data: {
        mode: 'Template',
        snapshot: snapshot
      },
      width: '376px'
    });
  }

  public handleSnapshotDelete(snapshot: Snapshot, volume): void {
    let notificationId: string;

    this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
      .switchMap((res) => {
        if (res) {
          snapshot['loading'] = true;
          notificationId = this.jobNotificationService.add('JOB_NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
          return this.snapshotService.remove(snapshot.id);
        } else {
          return Observable.throw(null);
        }
      })
      .finally(() => snapshot['loading'] = false)
      .subscribe(
        () => {
          this.statsUpdateService.next();
          volume.snapshots = volume.snapshots.filter(_ => _.id !== snapshot.id);
          this.jobNotificationService.finish({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_DONE'
          });
        },
        error => {
          if (!error) {
            return;
          }

          this.notificationService.error(error);
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'JOB_NOTIFICATIONS.SNAPSHOT.DELETION_FAILED'
          });
        });
  }
}
