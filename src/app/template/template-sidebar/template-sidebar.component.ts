import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';
import { ListService } from '../../shared/components/list/list.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { AuthService } from '../../shared/services/auth.service';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cs-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class TemplateSidebarComponent extends BaseTemplateSidebarComponent {
  constructor(
    service: TemplateService,
    authService: AuthService,
    dateTimeFormatterService: DateTimeFormatterService,
    route: ActivatedRoute,
    router: Router,
    listService: ListService,
    notificationService: NotificationService,
    store: Store<State>
  ) {
    super(
      service,
      authService,
      dateTimeFormatterService,
      route,
      router,
      listService,
      notificationService,
      store
    );
  }
}
