import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

@Component({
  selector: 'cs-date-picker-dialog',
  templateUrl: 'date-picker-dialog.component.html',
  styleUrls: ['date-picker-dialog.component.scss']
})
export class DatePickerDialogComponent {
  private selectedDate: Date;

  constructor(
    private dialog: MdlDialogReference,
    @Inject('Date') public initialDate: Date
  ) { }

  public setSelectedDate(date: Date): void {
    this.selectedDate = date;
  }

  public hide(): void {
    if (this.selectedDate) {
      this.dialog.hide(this.selectedDate);
    }
    this.dialog.hide(this.initialDate);
  }
}
