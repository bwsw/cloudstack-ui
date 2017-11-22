import { Component } from '@angular/core';
import { BaseTemplateDetailsComponent } from './details.component';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'cs-iso-details',
  templateUrl: './details.component.html',
styleUrls: ['./details.component.scss']
})
export class IsoDetailsComponent extends BaseTemplateDetailsComponent {
  constructor(notificationService: NotificationService) {
    super(notificationService);
  }
}
