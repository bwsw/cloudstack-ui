import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cs-vm-logs-minutes',
  templateUrl: 'vm-logs-minutes.component.html',
  styleUrls: ['../../../styles/settings-section.scss'],
})
export class VmLogsMinutesComponent {
  @Input()
  public minutes: number;
  @Output()
  public minutesChanged = new EventEmitter<number>();
}
