import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotificationStatus, JobNotification } from '../../services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box-item',
  templateUrl: 'notification-box-item.component.html',
  styleUrls: ['notification-box-item.component.scss']
})
export class NotificationBoxItemComponent {
  public notificationStatus = INotificationStatus;

  @Output() public onClose = new EventEmitter<string>();
  @Input() public notification: JobNotification;

  public remove(): void {
    this.onClose.emit(this.notification.id);
  }
}
