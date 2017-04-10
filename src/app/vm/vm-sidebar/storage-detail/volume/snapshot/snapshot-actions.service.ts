import { Injectable } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';

import { TemplateService } from '../../../../../template/shared';
import { JobsNotificationService, NotificationService, SnapshotService } from '../../../../../shared/services';
import { TemplateCreationComponent } from '../../../../../template/template-creation/template-creation.component';
import { Snapshot, Volume } from '../../../../../shared/models';
import { TranslateService } from 'ng2-translate';


export interface SnapshotAction {
  name: string;
  icon: string;
  action(snapshot: Snapshot, volume?: Volume);
}

@Injectable()
export class SnapshotActionsService {
  public Actions: Array<SnapshotAction> = [
    {
      name: 'CREATE_TEMPLATE_BUTTON',
      icon: 'add',
      action: (snapshot) => this.showCreationDialog(snapshot)
    },
    {
      name: 'REVERT_TO_SNAPSHOT',
      icon: 'replay',
      action: () => {}
    },
    {
      name: 'DELETE',
      icon: 'delete',
      action: (snapshot, volume) => this.handleSnapshotDelete(snapshot, volume)
    },
  ];

  constructor(
    private dialogService: MdlDialogService,
    private jobNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private templateService: TemplateService,
    private translateService: TranslateService,
    private snapshotService: SnapshotService
  ) { }

  public showCreationDialog(snapshot: Snapshot): void {
    this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      classes: 'template-creation-dialog-snapshot dialog-overflow-visible',
      providers: [
        { provide: 'mode', useValue: 'Template' },
        { provide: 'snapshot', useValue: snapshot }
      ]
    })
      .switchMap(res => res.onHide())
      .subscribe(data => {
        if (data) {
          this.createTemplate(data);
        }
      });
  }

  public handleSnapshotDelete(snapshot: Snapshot, volume): void {
    let notificationId: string;

    this.translateService.get('CONFIRM_SNAPSHOT_DELETE')
      .switchMap(str => {
        return this.dialogService.confirm(str);
      })
      .switchMap(() => {
        notificationId = this.jobNotificationService.add('SNAPSHOT_DELETE_IN_PROGRESS');
        return this.snapshotService.remove(snapshot.id);
      })
      .subscribe(
        () => {
          volume.snapshots = volume.snapshots.filter(_ => _.id !== snapshot.id);
          this.jobNotificationService.finish({
            id: notificationId,
            message: 'SNAPSHOT_DELETE_DONE'
          });
        },
        error => {
          if (!error) {
            return;
          }
          this.notificationService.error(error);
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'SNAPSHOT_DELETE_FAILED'
          });
        }
      );
  }

    private createTemplate(data): void {
      let notificationId = this.jobNotificationService.add('TEMPLATE_CREATION_IN_PROGRESS');
      this.templateService.create(data)
        .subscribe(
          () => {
            this.jobNotificationService.finish({
              id: notificationId,
              message: 'TEMPLATE_CREATION_DONE'
            });
          },
          error => {
            this.notificationService.error(error.errortext);
            this.jobNotificationService.fail({
              id: notificationId,
              message: 'TEMPLATE_CREATION_FAILED'
            });
          }
        );
    }
}
