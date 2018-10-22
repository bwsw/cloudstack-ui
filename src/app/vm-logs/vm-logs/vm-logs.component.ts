import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'cs-vm-logs',
  templateUrl: 'vm-logs.component.html',
  styleUrls: ['vm-logs.component.scss']
})
export class VmLogsComponent {
  @Input() public isAutoUpdateEnabled: boolean;
  @Input() public selectedVmId: string;
  @Output() public onAutoUpdate = new EventEmitter<void>();
  @Output() public onAutoUpdateStop = new EventEmitter<void>();
}
