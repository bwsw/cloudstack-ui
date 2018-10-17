import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, first, takeUntil, tap } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import * as cloneDeep from 'lodash/cloneDeep';

import { RouterUtilsService } from '../../../shared/services/router-utils.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { transformHandle, transformLinks } from './sidenav-animations';
import { NavigationItem, nonDraggableRoutes, SidenavRoute, sidenavRoutes } from './sidenav-routes';
import { SidenavRouteId } from '../../config';
import { SidenavConfigElement } from '../../../shared/models/config';
import { configSelectors, layoutActions, State, UserTagsActions, UserTagsSelectors } from '../../../root-store';

@Component({
  selector: 'cs-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [transformHandle, transformLinks],
})
export class SidenavComponent extends WithUnsubscribe() implements OnInit, OnDestroy {
  @ViewChild('navigationBar')
  public navigationBar: ElementRef;
  @Input()
  public open: boolean;
  @Input()
  public title: string;
  @Input()
  public allowConfiguring: boolean;
  public imgUrl = 'url(img/cloudstack_logo_light.png)';

  public routes: SidenavRoute[] = cloneDeep(sidenavRoutes);
  public nonDraggableRoutes = nonDraggableRoutes;

  public navigationLoaded = false;
  public updatingOrder = false;
  public dragulaContainerName = 'sidebar-bag';

  // tslint:disable-next-line:variable-name
  private _editing = false;
  private hasChanges = false;

  constructor(
    private dragula: DragulaService,
    private routerUtilsService: RouterUtilsService,
    private router: Router,
    private store: Store<State>,
  ) {
    super();
  }

  public ngOnInit() {
    this.setUpRoutes();
    this.setUpDragula();
    this.initNavigationOrder();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dragula.destroy(this.dragulaContainerName);
  }

  public get editing(): boolean {
    return this._editing;
  }

  public linkClick(routerLink: string): void {
    if (routerLink === this.routerUtilsService.getRouteWithoutQueryParams()) {
      this.router.navigate(['reload'], {
        queryParamsHandling: 'preserve',
      });
    }
  }

  public get currentYear(): string {
    return new Date().getFullYear().toString();
  }

  public closeSidenav(): void {
    this.store.dispatch(new layoutActions.CloseSidenav());
  }

  public toggleEditing(): void {
    if (this.updatingOrder) {
      return;
    }
    if (this.editing && this.hasChanges) {
      this.hasChanges = false;
      this.updatingOrder = true;

      const menuState = this.stringifyMenuState(this.routes);
      this.store.dispatch(new UserTagsActions.UpdateNavigationOrder({ value: menuState }));
      this.updatingOrder = false;
    }
    this.toggleState();
  }

  public handleRouteChecked() {
    this.hasChanges = true;
  }

  public isAlwaysVisible(route: SidenavRoute): boolean {
    const visibleRouteIds: SidenavRouteId[] = ['VMS'];
    return visibleRouteIds.findIndex(id => id === route.id) >= 0;
  }

  public setUpRoutes() {
    if (!this.allowConfiguring) {
      return;
    }

    this.store
      .pipe(
        select(configSelectors.get('configureSidenav')),
        first(),
      )
      .subscribe((sidenavConfiguration: SidenavConfigElement[]) => {
        const routesMap = this.getRoutesMap();
        this.routes = sidenavConfiguration.map(confElement => {
          const route = routesMap[confElement.id];
          route.visible = confElement.visible;
          return route;
        });
      });
  }

  private setUpDragula(): void {
    this.dragula.setOptions(this.dragulaContainerName, {
      moves: () => this.editing,
    });

    this.dragula.dropModel.pipe(takeUntil(this.unsubscribe$)).subscribe(() => (this.hasChanges = true));
  }

  private initNavigationOrder() {
    if (this.allowConfiguring) {
      this.store
        .pipe(
          select(UserTagsSelectors.getNavigationOrder),
          tap(() => (this.navigationLoaded = true)),
          filter(Boolean),
        )
        .subscribe(tag => {
          const order = this.parseMenuState(tag);

          if (this.validateNavigationOrder(order)) {
            const predicate = this.navigationPredicate(order);
            this.routes.sort(predicate);
            this.routes.forEach((route, i) => (route.visible = order[i].visible));
          }
        });
    } else {
      this.navigationLoaded = true;
    }
  }

  private toggleState(): void {
    this._editing = !this._editing;
  }

  private getRoutesMap(): { [id: string]: SidenavRoute } {
    return this.routes.reduce((map, route) => {
      map[route.id] = route;
      return map;
    }, {});
  }

  private validateNavigationOrder(order: NavigationItem[]): boolean {
    if (order.length !== this.routes.length) {
      return false;
    }

    return order.every(el => el.visible != null && el.id != null && !!this.routes.find(route => route.id === el.id));
  }

  private navigationPredicate(order: NavigationItem[]) {
    return (a: NavigationItem, b: NavigationItem) =>
      order.findIndex(el => el.id === a.id) - order.findIndex(el => el.id === b.id);
  }

  private stringifyMenuState(routes: NavigationItem[]): string {
    return routes.map(el => `${el.id}:${+el.visible}`).join(';');
  }

  private parseMenuState(menuStateString: string): NavigationItem[] {
    return menuStateString
      .split(';')
      .filter(Boolean)
      .map((menuElement: string) => {
        const [id, visible] = menuElement.split(':');
        return {
          id,
          visible: visible === '1',
        };
      });
  }
}
