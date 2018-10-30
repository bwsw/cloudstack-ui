import { Component, Input } from '@angular/core';
import { INotificationStatus, JobNotification } from '../../services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box-item',
  templateUrl: 'notification-box-item.component.html',
  styleUrls: ['notification-box-item.component.scss'],
})
export class NotificationBoxItemComponent {
  @Input()
  public notification: JobNotification;
  public notificationStatus = INotificationStatus;
}
