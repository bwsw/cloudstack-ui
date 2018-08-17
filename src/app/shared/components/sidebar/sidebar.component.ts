import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseModelInterface } from '../../models/base.model';
import { BaseBackendService } from '../../services/base-backend.service';
import { SnackBarService } from '../../../core/services';
import { EntityDoesNotExistError } from './entity-does-not-exist-error';


export abstract class SidebarComponent<M extends BaseModelInterface> implements OnInit {
  public entity: M;
  public notFound: boolean;

  constructor(
    protected entityService: BaseBackendService<M>,
    protected notificationService: SnackBarService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  public ngOnInit(): void {
    this.pluckId()
      .switchMap(id => this.loadEntity(id))
      .subscribe(
        entity => this.entity = entity,
        error => {
          if (error instanceof EntityDoesNotExistError) {
            this.onEntityDoesNotExist();
          } else {
            this.onError(error);
          }
        }
      );
  }

  public tabIsActive(tabId: string) {
    const path = this.route.snapshot;
    const pathLastChild = path.firstChild ? path.firstChild.routeConfig.path : null;
    return (tabId === pathLastChild)
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
    this.notificationService.open(error.message).subscribe();
  }
}
