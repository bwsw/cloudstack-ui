import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VirtualMachine } from '../../vm';

@Component({
  selector: 'cs-vm-logs-filter',
  templateUrl: 'vm-logs-filter.component.html'
})
export class VmLogsFilterComponent {
  // public dateTimeFormat = Intl.DateTimeFormat;
  // public date = new Date();
  @Input() public vmId: string;
  @Input() public vms: Array<VirtualMachine>;
  @Input() public selectedVmId: Array<string>;
  @Output() public onVmChange = new EventEmitter();
  @Output() public onRefresh = new EventEmitter();
  // @Output() public onNewestFirstChange = new EventEmitter();
}
