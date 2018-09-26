import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';

import { DiskOffering } from '../../../models';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<DiskOfferingDialogComponent>,
  ) {
    this.diskOfferings = new MatTableDataSource<DiskOffering>(data.diskOfferings);
    this.selectedDiskOffering = data.diskOffering;
    this.columns = data.columns;
    this.columnsToDisplay = [...this.columns, 'radioButton'];
  }

  public offeringCreated(date: string): Date {
    return moment(date).toDate();
  }

  public isElementInArray(column: string, columns: Array<string>): boolean {
    return 0 <= columns.indexOf(column);
  }

  public selectOffering(offering: DiskOffering) {
    this.selectedDiskOffering = offering;
  }

  public onSubmit(): void {
    this.dialogRef.close(this.selectedDiskOffering);
  }

  public isSubmitButtonDisabled() {
    const isDiskOfferingNotSelected = !this.selectedDiskOffering;
    const isNoDiskOfferings = !this.diskOfferings.data.length;
    return isDiskOfferingNotSelected || isNoDiskOfferings;
  }
}
