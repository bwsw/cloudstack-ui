import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { DiskOffering } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { Utils } from '../../../services/utils/utils.service';
import { isCustomized } from '../../../models/offering.model';

@Component({
  selector: 'cs-disk-offering-dialog',
  templateUrl: 'disk-offering-dialog.component.html',
  styleUrls: ['disk-offering-dialog.component.scss'],
})
export class DiskOfferingDialogComponent {
  public diskOfferings: DiskOffering[];
  public selectedDiskOffering: DiskOffering;
  public storageAvailable: number | null;
  public resourcesLimitExceeded = false;
  public minSize: number = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<DiskOfferingDialogComponent>,
    public authService: AuthService,
  ) {
    this.diskOfferings = data.diskOfferings;
    this.selectedDiskOffering = data.diskOffering;
    this.storageAvailable = data.storageAvailable;
    this.minSize = this.authService.getCustomDiskOfferingMinSize();
    this.checkResourcesLimit();
  }

  public offeringCreated(date: string): Date {
    return moment(date).toDate();
  }

  public convertToMb(bytes: number): number {
    const megabytes = Utils.convertBytesToMegabytes(bytes);
    return Math.round(megabytes);
  }

  public selectOffering(offering: DiskOffering) {
    this.selectedDiskOffering = offering;
    this.checkResourcesLimit();
  }

  public preventTriggerExpansionPanel(e: Event) {
    e.stopPropagation(); // Don't open/close expansion panel when click on radio button
  }

  public onSubmit(): void {
    this.dialogRef.close(this.selectedDiskOffering);
  }

  public isSubmitButtonDisabled() {
    const isDiskOfferingNotSelected = !this.selectedDiskOffering;
    const isNoDiskOfferings = !this.diskOfferings.length;
    return this.resourcesLimitExceeded || isDiskOfferingNotSelected || isNoDiskOfferings;
  }

  private checkResourcesLimit() {
    const diskSize = this.selectedDiskOffering
      ? isCustomized(this.selectedDiskOffering)
        ? this.minSize
        : this.selectedDiskOffering.disksize
      : undefined;

    this.resourcesLimitExceeded =
      !!this.storageAvailable && diskSize ? this.storageAvailable < Number(diskSize) : false;
  }
}
