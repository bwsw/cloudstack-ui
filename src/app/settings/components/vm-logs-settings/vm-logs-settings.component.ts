import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SettingsViewModel } from '../../view-models';

@Component({
  selector: 'cs-vm-logs-settings',
  templateUrl: 'vm-logs-settings.component.html',
  styleUrls: ['../../styles/settings-section.scss'],
})
export class VmLogsSettingsComponent {
  @Input()
  public settings: SettingsViewModel;
  @Output()
  public messagesChange = new EventEmitter<number>();
  @Output()
  public minutesChange = new EventEmitter<number>();

  public onMessagesChange(value: number) {
    this.messagesChange.emit(value);
  }

  public onMinutesChange(value: number) {
    this.minutesChange.emit(value);
  }
}
