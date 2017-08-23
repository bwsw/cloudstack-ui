import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseModel } from '../../models/base.model';
import { BaseBackendService } from '../../services/base-backend.service';
import { NotificationService } from '../../services/notification.service';


export abstract class SidebarComponent<M extends BaseModel> implements OnInit {
  public entity: M;
  public notFound: boolean;

  constructor(
    protected entityService: BaseBackendService<M>,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.pluckId()
      .switchMap(id => this.loadEntity(id))
      .switchMap(entity => {
        if (entity) {
          return this.modifyEntity(entity);
        } else {
          return Observable.throw('ENTITY_DOES_NOT_EXIST');
        }
      })
      .subscribe(
        entity => this.entity = entity,
        error => {
          if (error === 'ENTITY_DOES_NOT_EXIST') {
            this.onEntityDoesNotExist();
          } else {
            this.onError(error);
          }
        }
      );
  }

  private pluckId(): Observable<string> {
    return this.route.params.pluck('id').filter(id => !!id) as Observable<string>;
  }

  protected loadEntity(id: string): Observable<M> {
    return this.entityService.get(id);
  }

  protected modifyEntity(entity: M): Observable<M> {
    return Observable.of(entity);
  }

  private onEntityDoesNotExist(): void {
    this.notFound = true;
  }

  private onError(error: any): void {
    this.notificationService.error(error.message);
  }
}
