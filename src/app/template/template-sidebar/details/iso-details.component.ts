import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateDetailsComponent } from './details.component';
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
    service: IsoService,
    route: ActivatedRoute,
    notificationService: NotificationService,
    listService: ListService
  ) {
    super(service, route, notificationService, listService);
  }
}
