import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateDetailsComponent } from './details.component';
import { TemplateActionsService } from '../../shared/template-actions.service';
import { ListService } from '../../../shared/components/list/list.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { IsoService } from '../../shared/iso.service';

@Component({
  selector: 'cs-iso-details',
  templateUrl: './details.component.html',
styleUrls: ['./details.component.scss']
})
export class IsoDetailsComponent extends BaseTemplateDetailsComponent {
  constructor(
    templateService: IsoService,
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
