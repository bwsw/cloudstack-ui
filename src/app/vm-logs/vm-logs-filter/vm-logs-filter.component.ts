import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VirtualMachine } from '../../vm';
import { Keyword } from '../models/keyword.model';

@Component({
  selector: 'cs-vm-logs-filter',
  templateUrl: 'vm-logs-filter.component.html',
  styleUrls: ['vm-logs-filter.component.scss']
})
export class VmLogsFilterComponent {
  // public dateTimeFormat = Intl.DateTimeFormat;
  // public date = new Date();
  @Input() public vmId: string;
  @Input() public vms: Array<VirtualMachine>;
  @Input() public keywords: Array<Keyword>;
  @Input() public selectedVmId: Array<string>;
  @Output() public onVmChange = new EventEmitter();
  @Output() public onRefresh = new EventEmitter();
  @Output() public onKeywordAdd = new EventEmitter<Keyword>();
  @Output() public onKeywordRemove = new EventEmitter<Keyword>();
  // @Output() public onNewestFirstChange = new EventEmitter();
}
