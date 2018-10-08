import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VirtualMachine } from '../vm';

@Component({
  selector: 'cs-log-files-filter',
  templateUrl: 'log-files-filter.component.html'
})
export class LogFilesFilterComponent {
  @Input() public vms: Array<VirtualMachine>;
  @Input() public selectedVm: string = null;
  @Output() public onVmChange = new EventEmitter();

  public dateTimeFormat = Intl.DateTimeFormat;
  public date = new Date();
}
