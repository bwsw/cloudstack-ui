import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DiskOffering } from '../../../models';
import { ConfigService } from '../../../services/config.service';
import * as moment from 'moment';

@Component({
  selector: 'cs-disk-offering-dialog',
  templateUrl: 'disk-offering-dialog.component.html',
  styleUrls: ['disk-offering-dialog.component.scss'],
})
export class DiskOfferingDialogComponent {
  public diskOfferings: Array<DiskOffering>;
  public selectedDiskOffering: DiskOffering;
  public preselectedDiskOffering: DiskOffering;
  public tableId = 'DISK_OFFERING.TABLE';
  public columns: Array<string>;
  public customFields = ['provisioningtype', 'storagetype', 'iscustomized'];
  public notCustomFields = ['provisioningtype', 'storagetype', 'iscustomized', 'created', 'name'];

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<DiskOfferingDialogComponent>,
    public configService: ConfigService
  ) {
    this.diskOfferings = data.diskOfferings;
    this.selectedDiskOffering = data.diskOffering;
    this.preselectedDiskOffering = data.diskOffering;
    this.columns = data.columns;
  }

  public offeringCreated(date: string): Date {
    return moment(date).toDate();
  }

  public isCustomField(column: string, columns: Array<string>): boolean {
    return 0 <= columns.indexOf(column);
  }

  public selectOffering(offering: DiskOffering) {
    this.selectedDiskOffering = offering;
  }

  public onSubmit(): void {
    this.dialogRef.close(this.selectedDiskOffering);
  }
}
