import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, pluck, switchMap } from 'rxjs/operators';

import { BaseModel } from '../../models/base.model';
import { BaseBackendService } from '../../services/base-backend.service';
import { SnackBarService } from '../../../core/services';
import { EntityDoesNotExistError } from './entity-does-not-exist-error';

export abstract class SidebarComponent<M extends BaseModel> implements OnInit {
  public entity: M;
  public notFound: boolean;

  constructor(
    protected entityService: BaseBackendService<M>,
    protected notificationService: SnackBarService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {}

  public ngOnInit(): void {
    this.pluckId()
      .pipe(switchMap(id => this.loadEntity(id)))
      .subscribe(
        entity => (this.entity = entity),
        error => {
          if (error instanceof EntityDoesNotExistError) {
            this.onEntityDoesNotExist();
          } else {
            this.onError(error);
          }
        },
      );
  }

  public tabIsActive(tabId: string) {
    const path = this.route.snapshot;
    const pathLastChild = path.firstChild ? path.firstChild.routeConfig.path : null;
    return tabId === pathLastChild;
  }

  protected loadEntity(id: string): Observable<M> {
    return this.entityService.get(id);
  }

  private pluckId(): Observable<string> {
    return this.route.params.pipe(
      pluck('id'),
      filter(id => !!id),
    ) as Observable<string>;
  }

  private onEntityDoesNotExist(): void {
    this.notFound = true;
  }

  private onError(error: any): void {
    this.notificationService.open(error.message).subscribe();
  }
}
