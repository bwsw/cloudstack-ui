import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DiskOffering } from '../../../models';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'cs-disk-offering-dialog',
  templateUrl: 'disk-offering-dialog.component.html',
  styleUrls: ['disk-offering-dialog.component.scss'],
})
export class DiskOfferingDialogComponent implements OnInit {
  public diskOfferings: Array<DiskOffering>;
  public selectedDiskOffering: DiskOffering;
  public preselectedDiskOffering: DiskOffering;
  public tableId = 'DISK_OFFERING_TABLE';
  public columns: Array<string> = [
    'name',
    'bytesreadrate',
    'byteswriterate',
    'iopsreadrate',
    'iopswriterate'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<DiskOfferingDialogComponent>,
    public configService: ConfigService
  ) {
    this.diskOfferings = data.diskOfferings;
    this.selectedDiskOffering = data.diskOffering;
    this.preselectedDiskOffering = data.diskOffering;
  }

  public ngOnInit() {
    const configParams = this.configService.get('diskOfferingParameters');
    if (configParams) {
      this.columns = this.columns.concat(configParams);
    }
  }

  public selectOffering(offering: DiskOffering) {
    this.selectedDiskOffering = offering;
  }

  public onSubmit(): void {
    this.dialogRef.close(this.selectedDiskOffering);
  }
}
