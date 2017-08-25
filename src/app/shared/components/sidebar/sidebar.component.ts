import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  public ngOnInit(): void {
    this.pluckId()
      .switchMap(id => this.loadEntity(id))
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

  public onDetailsHide(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve'
    });
  }

  private pluckId(): Observable<string> {
    return this.route.params.pluck('id').filter(id => !!id) as Observable<string>;
  }

  protected loadEntity(id: string): Observable<M> {
    return this.entityService.get(id);
  }

  private onEntityDoesNotExist(): void {
    this.notFound = true;
  }

  private onError(error: any): void {
    this.notificationService.error(error.message);
  }
}
