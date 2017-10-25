import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { Volume } from '../../../models';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { VolumeService } from '../../../services/volume.service';
import { VirtualMachine } from '../../../../vm/shared/vm.model';
import { VmService } from '../../../../vm/shared/vm.service';


@Component({
  selector: 'cs-volume-attachment',
  templateUrl: 'volume-attachment.component.html',
  styleUrls: ['volume-attachment.component.scss']
})
export class VolumeAttachmentComponent implements OnInit {
  public virtualMachineId: string;
  public virtualMachines: Array<VirtualMachine>;
  public loading: boolean;

  public volume: Volume;
  public zoneId: string;

  constructor(
    private dialogRef: MatDialogRef<VolumeAttachmentComponent>,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private vmService: VmService,
    private volumeService: VolumeService,
    @Inject(MAT_DIALOG_DATA) data
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
}
