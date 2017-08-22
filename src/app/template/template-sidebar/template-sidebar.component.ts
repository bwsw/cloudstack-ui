import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TemplateService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';


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
    listService: ListService,
    dialogService: DialogService,
    notificationService: NotificationService
  ) {
    super(
      templateService,
      dateTimeFormatterService,
      route,
      dialogService,
      notificationService,
      listService
    );
  }
}
