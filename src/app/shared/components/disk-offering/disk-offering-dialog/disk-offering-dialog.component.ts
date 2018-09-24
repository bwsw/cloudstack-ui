import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { Account, DiskOffering } from '../../../models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'cs-disk-offering-dialog',
  templateUrl: 'disk-offering-dialog.component.html',
  styleUrls: ['disk-offering-dialog.component.scss'],
})
export class DiskOfferingDialogComponent {
  public diskOfferings: MatTableDataSource<DiskOffering>;
  public selectedDiskOffering: DiskOffering;
  public columns: Array<string>;
  public columnsToDisplay: string[];
  public fieldsToBeTranslated = ['provisioningtype', 'iscustomized'];
  public account: Account;
  public resourcesLimitExceeded = false;
  public minSize = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<DiskOfferingDialogComponent>,
    public authService: AuthService
  ) {
    this.diskOfferings = new MatTableDataSource<DiskOffering>(data.diskOfferings);
    this.selectedDiskOffering = data.diskOffering;
    this.columns = data.columns;
    this.columnsToDisplay = [...this.columns, 'radioButton'];
    this.account = data.account;
  }

  public offeringCreated(date: string): Date {
    return moment(date).toDate();
  }

  public isElementInArray(column: string, columns: Array<string>): boolean {
    return 0 <= columns.indexOf(column);
  }

  public selectOffering(offering: DiskOffering) {
    this.selectedDiskOffering = offering;
    this.checkResourcesLimit();
  }

  public onSubmit(): void {
    this.dialogRef.close(this.selectedDiskOffering);
  }

  public isSubmitButtonDisabled() {
    const isDiskOfferingNotSelected = !this.selectedDiskOffering;
    const isNoDiskOfferings = !this.diskOfferings.data.length;
    return isDiskOfferingNotSelected || isNoDiskOfferings;
  }

  private checkResourcesLimit() {
    this.minSize = this.authService.getCustomDiskOfferingMinSize();
    const diskSize = this.selectedDiskOffering.disksize === 0 ? this.minSize : this.selectedDiskOffering.disksize;
    this.resourcesLimitExceeded = Number(this.account.primarystorageavailable) < diskSize;
  }
}
