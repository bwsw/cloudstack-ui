import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-vm-logs',
  templateUrl: 'vm-logs.component.html',
  styleUrls: ['vm-logs.component.scss']
})
export class VmLogsComponent {
  @Input() public scroll: boolean;
  @Input() public selectedVmId: string;
  @Output() public onScroll = new EventEmitter<void>();
  @Output() public onScrollStop = new EventEmitter<void>();
}
