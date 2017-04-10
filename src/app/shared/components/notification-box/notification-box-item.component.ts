import { Component, Input, Output, EventEmitter } from '@angular/core';
import { INotification, INotificationStatus } from '../../services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box-item',
  templateUrl: 'notification-box-item.component.html',
  styleUrls: ['notification-box-item.component.scss']
})
export class NotificationBoxItemComponent {
  public notificationStatus = INotificationStatus;

  @Output() public onClose = new EventEmitter<string>();
  @Input() public notification: INotification;

  public remove(): void {
    this.onClose.emit(this.notification.id);
  }
}
