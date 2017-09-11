import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateDetailsComponent } from './details.component';
import { TemplateService } from '../../shared/template.service';
import { ListService } from '../../../shared/components/list/list.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'cs-template-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class TemplateDetailsComponent extends BaseTemplateDetailsComponent {
  constructor(
    service: TemplateService,
    route: ActivatedRoute,
    notificationService: NotificationService,
    listService: ListService
  ) {
    super(service, route, notificationService, listService);
  }
}
