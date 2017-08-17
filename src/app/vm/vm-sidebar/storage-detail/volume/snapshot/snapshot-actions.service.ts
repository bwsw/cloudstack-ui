import { Injectable } from '@angular/core';
import { DialogService } from '../../../../../dialog/dialog-module/dialog.service';

import { JobsNotificationService, NotificationService } from '../../../../../shared/services';
import { TemplateCreationComponent } from '../../../../../template/template-creation/template-creation.component';
import { Snapshot, Volume } from '../../../../../shared/models';
import { StatsUpdateService } from '../../../../../shared/services/stats-update.service';
import { SnapshotService } from '../../../../../shared/services/snapshot.service';
import { Action } from '../../../../../shared/interfaces/action.interface';
import { ActionsService } from '../../../../../shared/interfaces/action-service.interface';


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
    private dialogService: DialogService,
    private jobNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private snapshotService: SnapshotService,
    private statsUpdateService: StatsUpdateService
  ) { }

  public showCreationDialog(snapshot: Snapshot): void {
    this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      classes: 'template-creation-dialog-snapshot dialog-overflow-visible',
      providers: [
        { provide: 'mode', useValue: 'Template' },
        { provide: 'snapshot', useValue: snapshot }
      ]
    });
  }

  public handleSnapshotDelete(snapshot: Snapshot, volume): void {
    let notificationId: string;

    this.dialogService.confirm(
      'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION',
      'COMMON.NO',
      'COMMON.YES'
    )
      .switchMap(() => {
        snapshot['loading'] = true;
        notificationId = this.jobNotificationService.add('JOB_NOTIFICATIONS.SNAPSHOT.DELETION_IN_PROGRESS');
        return this.snapshotService.remove(snapshot.id);
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
