import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { AuthService } from '../../shared/services/auth.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TemplateService } from '../shared';
import { Template } from '../shared/template/template.model';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';


@Component({
  selector: 'cs-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class TemplateSidebarComponent extends BaseTemplateSidebarComponent<Template> {
  constructor(
    service: TemplateService,
    authService: AuthService,
    dateTimeFormatterService: DateTimeFormatterService,
    route: ActivatedRoute,
    router: Router,
    listService: ListService,
    notificationService: NotificationService
  ) {
    super(
      service,
      authService,
      dateTimeFormatterService,
      route,
      router,
      listService,
      notificationService
    );
  }
}
