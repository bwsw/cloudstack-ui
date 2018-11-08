import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-vm-logs-minutes',
  templateUrl: 'vm-logs-minutes.component.html',
  styleUrls: ['../../../styles/settings-section.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmLogsMinutesComponent {
  @Input()
  public minutes: number;
  @Output()
  public minutesChanged = new EventEmitter<number>();
}
