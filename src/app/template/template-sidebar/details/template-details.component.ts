import { Component } from '@angular/core';
import { BaseTemplateDetailsComponent } from './details.component';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'cs-template-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class TemplateDetailsComponent extends BaseTemplateDetailsComponent {
  constructor(notificationService: NotificationService) {
    super(notificationService);
  }
}
