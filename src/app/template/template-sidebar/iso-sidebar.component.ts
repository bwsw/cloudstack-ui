import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { NotificationService } from '../../shared/services/notification.service';
import { IsoService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';


@Component({
  selector: 'cs-iso-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class IsoSidebarComponent extends BaseTemplateSidebarComponent {
  constructor(
    isoService: IsoService,
    dateTimeFormatterService: DateTimeFormatterService,
    route: ActivatedRoute,
    listService: ListService,
    dialogService: DialogService,
    notificationService: NotificationService
  ) {
    super(
      isoService,
      dateTimeFormatterService,
      route,
      dialogService,
      notificationService,
      listService
    );
  }
}
