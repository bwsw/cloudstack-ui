import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'cs-date-picker-dialog',
  templateUrl: 'date-picker-dialog.component.html',
  styleUrls: ['date-picker-dialog.component.scss'],
})
export class DatePickerDialogComponent {
  public config;
  private selectedDate: Date;

  constructor(
    private dialogRef: MatDialogRef<DatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.config = data.datePickerConfig;
  }

  public setSelectedDate(date: Date): void {
    this.selectedDate = date;
  }

  public hide(setDate = true): void {
    if (!setDate || !this.selectedDate) {
      this.dialogRef.close();
      return;
    }

    if (this.selectedDate) {
      this.dialogRef.close(this.selectedDate);
      return;
    }
  }
}
