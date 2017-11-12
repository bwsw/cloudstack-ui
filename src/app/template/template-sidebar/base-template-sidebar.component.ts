import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ListService } from '../../shared/components/list/list.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../shared/services/auth.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { NotificationService } from '../../shared/services/notification.service';
import { BaseTemplateModel } from '../shared/base-template.model';
import { BaseTemplateService } from '../shared/base-template.service';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromOsTypes from '../redux/ostype.reducers';

export abstract class BaseTemplateSidebarComponent extends SidebarComponent<BaseTemplateModel> {
  private service: BaseTemplateService;
  public osTypes$ = this.store.select(fromOsTypes.selectAll);

  constructor(
    service: BaseTemplateService,
    public authService: AuthService,
    public dateTimeFormatterService: DateTimeFormatterService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected listService: ListService,
    protected notificationService: NotificationService,
    protected store: Store<State>
  ) {
    super(service, notificationService, route, router);
    this.service = service;
  }

  public get isSelf(): boolean {
    return (
      this.authService.user && this.authService.user.username === this.entity.account
    );
  }

  protected loadEntity(id: string): Observable<BaseTemplateModel> {
    return this.service.getWithGroupedZones(id).switchMap(template => {
      if (template) {
        return Observable.of(template);
      } else {
        return Observable.throw(new EntityDoesNotExistError());
      }
    });
  }
}
