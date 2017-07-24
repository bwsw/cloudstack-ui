import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';


@Component({
  selector: 'cs-date-picker-dialog',
  templateUrl: 'date-picker-dialog.component.html',
  styleUrls: ['date-picker-dialog.component.scss']
})
export class DatePickerDialogComponent {
  private selectedDate: Date;

  constructor(
    private dialogRef: MdDialogRef<DatePickerDialogComponent>,
    @Inject(MD_DIALOG_DATA) public config
  ) { }

  public setSelectedDate(date: Date): void {
    this.selectedDate = date;
  }

  public hide(setDate = true): void {
    if (!setDate || !this.selectedDate) {
      this.dialogRef.close();
    }
    if (this.selectedDate) {
      this.dialogRef.close(this.selectedDate);
    }
  }
}
