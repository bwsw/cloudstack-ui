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
  activate(snapshot: Snapshot, volume?: Volume): void;
}

@Injectable()
export class SnapshotActionsService {
  public Actions: Array<SnapshotAction> = [
    {
      name: 'CREATE_TEMPLATE_BUTTON',
      icon: 'add',
      activate: (snapshot) => this.showCreationDialog(snapshot)
    },
    {
      name: 'DELETE',
      icon: 'delete',
      activate: (snapshot, volume) => this.handleSnapshotDelete(snapshot, volume)
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
          this.createTemplate(data, snapshot);
        }
      });
  }

  public handleSnapshotDelete(snapshot: Snapshot, volume): void {
    let notificationId: string;

    this.translateService.get(['CONFIRM_SNAPSHOT_DELETE', 'NO', 'YES'])
      .switchMap(str => this.dialogService.confirm(str['CONFIRM_SNAPSHOT_DELETE'], str['NO'], str['YES']))
      .switchMap(() => {
        snapshot['loading'] = true;
        notificationId = this.jobNotificationService.add('SNAPSHOT_DELETE_IN_PROGRESS');
        return this.snapshotService.remove(snapshot.id);
      })
      .finally(() => snapshot['loading'] = false)
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

  private createTemplate(data, snapshot): void {
    snapshot['loading'] = true;
    let notificationId = this.jobNotificationService.add('TEMPLATE_CREATION_IN_PROGRESS');
    this.templateService.create(data)
      .finally(() => snapshot['loading'] = false)
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
