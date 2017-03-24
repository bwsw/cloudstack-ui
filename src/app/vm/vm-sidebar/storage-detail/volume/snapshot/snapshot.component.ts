import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Snapshot } from '../../../../../shared/models/snapshot.model';
import { MdlDialogService } from 'angular2-mdl';
import { TemplateCreationComponent } from '../../../../../template/template-creation/template-creation.component';
import { JobsNotificationService } from '../../../../../shared/services/jobs-notification.service';
import { TemplateService } from '../../../../../template/shared/template.service';
import { NotificationService } from '../../../../../shared/services/notification.service';


@Component({
  selector: 'cs-snapshot',
  templateUrl: 'snapshot.component.html',
  styleUrls: ['snapshot.component.scss']
})
export class SnapshotComponent {
  @Input() public snapshot: Snapshot;
  @Output() public onSnapshotDelete = new EventEmitter<Snapshot>();

  constructor(
    private dialogService: MdlDialogService,
    private jobNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private templateService: TemplateService
  ) {}

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      classes: 'template-creation-dialog-snapshot dialog-overflow-visible',
      providers: [
        { provide: 'mode', useValue: 'Template' },
        { provide: 'snapshot', useValue: this.snapshot }
      ]
    })
      .switchMap(res => res.onHide())
      .subscribe(data => {
        if (data) {
          this.createTemplate(data);
        }
      });
  }

  public deleteSnapshot(): void {
    this.onSnapshotDelete.emit(this.snapshot);
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
          this.notificationService.error(error.json()['createtemplateresponse']['errortext']);
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'TEMPLATE_CREATION_FAILED'
          });
        });
  }
}

