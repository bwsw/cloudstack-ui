import { Component } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';

import { DatePickerDialogComponent } from './date-picker-dialog.component';

@Component({
  selector: 'cs-date-picker',
  templateUrl: 'date-picker.component.html'
})
export class DatePickerComponent {
  public date: Date = new Date();
  private isDialogOpen = false;

  constructor(private dialogService: MdlDialogService) { }

  public onFocus(_e: Event): void {
    if (this.isDialogOpen) {
      return;
    }

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
        this.date = date;
      });
  }
}
