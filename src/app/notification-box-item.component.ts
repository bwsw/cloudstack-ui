import { Component, Input, Output, EventEmitter } from '@angular/core';
import { INotification, INotificationStatus } from './shared/services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box-item',
  templateUrl: './notification-box-item.component.html',
  styleUrls: ['./notification-box-item.component.scss']
})
export class NotificationBoxItemComponent {
  @Input() private notification: INotification;

  @Output() public onClose = new EventEmitter<string>();

  public notificationStatus = INotificationStatus;

  public remove() {
    this.onClose.emit(this.notification.id);
  }
}
