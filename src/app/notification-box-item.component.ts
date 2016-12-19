import { Component, Input, Output, EventEmitter } from '@angular/core';
import { INotification } from './shared/services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box-item',
  templateUrl: './notification-box-item.component.html',
  styleUrls: ['./notification-box-item.component.scss']
})
export class NotificationBoxItemComponent {
  @Output() public onClose = new EventEmitter<string>();
  @Input() private notification: INotification;

  public remove() {
    this.onClose.emit(this.notification.id);
  }
}
