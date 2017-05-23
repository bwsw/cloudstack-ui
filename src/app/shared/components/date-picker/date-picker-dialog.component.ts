import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from '../../services/dialog';

@Component({
  selector: 'cs-date-picker-dialog',
  templateUrl: 'date-picker-dialog.component.html',
  styleUrls: ['date-picker-dialog.component.scss']
})
export class DatePickerDialogComponent {
  private selectedDate: Date;

  constructor(
    private dialog: MdlDialogReference,
    @Inject('datePickerConfig') public config
  ) { }

  public setSelectedDate(date: Date): void {
    this.selectedDate = date;
  }

  public hide(setDate = true): void {
    if (!setDate || !this.selectedDate) {
      this.dialog.hide();
    }
    if (this.selectedDate) {
      this.dialog.hide(this.selectedDate);
    }
  }
}
