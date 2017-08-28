import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';
import { TemplateActionsService } from '../shared/template-actions.service';
import { ListService } from '../../shared/components/list/list.service';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';

@Component({
  selector: 'cs-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class TemplateSidebarComponent extends BaseTemplateSidebarComponent {
  constructor(
    templateService: TemplateService,
    dateTimeFormatterService: DateTimeFormatterService,
    route: ActivatedRoute,
    router: Router,
    templateActions: TemplateActionsService,
    listService: ListService,
    dialogService: DialogService,
    notificationService: NotificationService
  ) {
    super(
      templateService,
      dateTimeFormatterService,
      dialogService,
      route,
      router,
      listService,
      notificationService,
      templateActions
    );
  }
}
