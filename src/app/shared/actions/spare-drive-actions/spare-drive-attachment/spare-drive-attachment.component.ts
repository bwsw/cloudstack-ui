import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { Volume } from '../../../models';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { VolumeService } from '../../../services/volume.service';
import { VirtualMachine } from '../../../../vm/shared/vm.model';
import { VmService } from '../../../../vm/shared/vm.service';


@Component({
  selector: 'cs-spare-drive-attachment',
  templateUrl: 'spare-drive-attachment.component.html',
  styleUrls: ['spare-drive-attachment.component.scss']
})
export class SpareDriveAttachmentComponent implements OnInit {
  public virtualMachineId: string;
  public virtualMachines: Array<VirtualMachine>;
  public loading: boolean;

  public volume: Volume;
  public zoneId: string;

  constructor(
    private dialogRef: MdDialogRef<SpareDriveAttachmentComponent>,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private vmService: VmService,
    private volumeService: VolumeService,
    @Inject(MD_DIALOG_DATA) data
  ) {
    this.volume = data.volume;
    this.zoneId = data.zoneId;
  }

  public ngOnInit(): void {
    this.vmService.getListWithDetails({ zoneId: this.zoneId })
      .subscribe(vmList => {
        this.virtualMachines = vmList;
        if (this.virtualMachines.length) {
          this.virtualMachineId = this.virtualMachines[0].id;
        }
      });
  }

  public attach(): void {
    if (!this.virtualMachineId) {
      this.dialogRef.close();
      return;
    }

    this.loading = true;
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');

    this.volumeService.attach({
      id: this.volume.id,
      virtualMachineId: this.virtualMachineId
    })
      .do(() => {
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE',
        });
      })
      .catch(error => {
        this.dialogService.alert({
          message: {
            translationToken: error.message,
            interpolateParams: error.params
          }
        });

        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED',
        });

        return Observable.throw(error);
      })
      .finally(() => this.loading = false)
      .subscribe(() => this.dialogRef.close(this.virtualMachineId));
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
