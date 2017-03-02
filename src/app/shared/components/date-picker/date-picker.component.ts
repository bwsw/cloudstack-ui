import { Component } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';

import { DatePickerDialogComponent } from './date-picker-dialog.component';
import {
  dateTimeFormat as DateTimeFormat,
  formatIso
} from './dateUtils';


@Component({
  selector: 'cs-date-picker',
  templateUrl: 'date-picker.component.html'
})
export class DatePickerComponent {
  public date: Date = new Date();
  public displayDate: string;

  public locale;

  private isDialogOpen = false;

  constructor(private dialogService: MdlDialogService) {
    this.displayDate = this.formatDate();
  }

  public onFocus(e: Event): void {
    if (this.isDialogOpen) {
      return;
    }
    (e.target as HTMLInputElement).blur();

    this.isDialogOpen = true;
    this.dialogService.showCustomDialog({
      component: DatePickerDialogComponent,
      classes: 'date-picker-dialog',
      providers: [{ provide: 'Date', useValue: this.date }]
    })
      .switchMap(res => res.onHide())
      .onErrorResumeNext()
      .subscribe((date: Date) => {
        this.isDialogOpen = false;
        if (date) {
          this.date = date;
          this.displayDate = this.formatDate();
        }
      });
  }

  private formatDate(): string {
    if (this.locale) {
      return new DateTimeFormat(this.locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(this.date);
    } else {
      return formatIso(this.date);
    }
  }
}
