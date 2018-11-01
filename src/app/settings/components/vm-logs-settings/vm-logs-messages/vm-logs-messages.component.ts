import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cs-vm-logs-messages',
  templateUrl: 'vm-logs-messages.component.html',
  styleUrls: ['../../../styles/settings-section.scss'],
})
export class VmLogsMessagesComponent {
  @Input()
  public messages: number;
  @Output()
  public messagesChanged = new EventEmitter<number>();
}
