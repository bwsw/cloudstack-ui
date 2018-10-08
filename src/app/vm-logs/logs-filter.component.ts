import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cs-logs-filter',
  templateUrl: 'logs-filter.component.html'
})
export class LogsFilterComponent {
  public dateTimeFormat = Intl.DateTimeFormat;
  public date = new Date();

  @Output() public onNewestFirstChange = new EventEmitter();
}
