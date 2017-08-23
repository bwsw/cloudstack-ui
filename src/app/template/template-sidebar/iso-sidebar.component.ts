import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { IsoService } from '../shared';
import { TemplateActionsService } from '../shared/template-actions.service';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';

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
    templateActions: TemplateActionsService,
    listService: ListService,
    dialogService: DialogService,
    notificationService: NotificationService
  ) {
    super(
      isoService,
      dateTimeFormatterService,
      dialogService,
      route,
      listService,
      notificationService,
      templateActions
    );
  }
}
