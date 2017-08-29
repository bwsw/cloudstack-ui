import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateDetailsComponent } from './details.component';
import { TemplateService } from '../../shared/template.service';
import { TemplateActionsService } from '../../shared/template-actions.service';
import { ListService } from '../../../shared/components/list/list.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'cs-template-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class TemplateDetailsComponent extends BaseTemplateDetailsComponent {
  constructor(
    templateService: TemplateService,
    route: ActivatedRoute,
    templateActions: TemplateActionsService,
    listService: ListService,
    notificationService: NotificationService
  ) {
    super(
      templateService,
      route,
      notificationService,
      templateActions,
      listService
    );
  }
}
