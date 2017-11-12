import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { NotificationService } from '../../shared/services/notification.service';
import { IsoService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';
import { AuthService } from '../../shared/services/auth.service';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';


@Component({
  selector: 'cs-iso-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class IsoSidebarComponent extends BaseTemplateSidebarComponent {
  constructor(
    service: IsoService,
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
