import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DragulaService } from 'ng2-dragula';
import * as cloneDeep from 'lodash/cloneDeep';

import { ConfigService } from '../../services';
import { LayoutService } from '../../../shared/services/layout.service';
import { RouterUtilsService } from '../../../shared/services/router-utils.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { transformHandle, transformLinks } from './sidenav-animations';
import { NavigationItem, nonDraggableRoutes, SidenavRoute, sidenavRoutes } from './sidenav-routes';
import { State, UserTagsActions, UserTagsSelectors } from '../../../root-store';


@Component({
  selector: 'cs-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [transformHandle, transformLinks]
})
export class SidenavComponent extends WithUnsubscribe() implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('navigationBar') public navigationBar: ElementRef;
  @Input() public open: boolean;
  @Input() public title: string;
  public imgUrl = 'url(img/cloudstack_logo_light.png)';

  public routes: Array<SidenavRoute> = cloneDeep(sidenavRoutes);
  public nonDraggableRoutes = nonDraggableRoutes;

  public navigationLoaded = false;
  public updatingOrder = false;
  public dragulaContainerName = 'sidebar-bag';

  private _editing = false;
  private hasChanges = false;

  constructor(
    private configService: ConfigService,
    private dragula: DragulaService,
    private layoutService: LayoutService,
    private routerUtilsService: RouterUtilsService,
    private router: Router,
    private store: Store<State>
  ) {
    super();
  }

  public ngOnInit() {
    this.setUpRoutes();
    this.setUpDragula();
    this.initNavigationOrder();
  }

  public ngAfterViewInit(): void {
    this.layoutService.drawerToggled
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.toggleDrawer());
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dragula.destroy(this.dragulaContainerName);
  }

  public get editing(): boolean {
    return this._editing;
  }

  public get canEdit(): boolean {
    return this.configService.get<boolean>('allowReorderingSidebar');
  }

  public linkClick(routerLink: string): void {
    if (routerLink === this.routerUtilsService.getRouteWithoutQueryParams()) {
      this.router.navigate(['reload'], {
        queryParamsHandling: 'preserve'
      });
    }
  }

  public get currentYear(): string {
    return new Date().getFullYear().toString();
  }

  public toggleDrawer(): void {
    this.layoutService.toggleDrawer();
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

  private setUpDragula(): void {
    this.dragula.setOptions(this.dragulaContainerName, {
      moves: () => this.editing
    });

    this.dragula.dropModel
      .takeUntil(this.unsubscribe$)
      .subscribe(() => (this.hasChanges = true));
  }

  private initNavigationOrder() {
    if (this.canEdit) {
      this.store.select(UserTagsSelectors.getNavigationOrder)
        .do(() => this.navigationLoaded = true)
        .filter(Boolean)
        .subscribe(tag => {
          const order = this.parseMenuState(tag);

          if (this.validateNavigationOrder(order)) {
            const predicate = this.navigationPredicate(order);
            this.routes.sort(predicate);
            this.routes.forEach((
              route,
              i
            ) => route.enabled = (!this.canEdit || (this.canEdit && order[i].enabled)));
          }
      });
    } else {
      this.navigationLoaded = true;
    }
  }

  private toggleState(): void {
    this._editing = !this._editing;
  }

  public setUpRoutes() {
    if (this.canEdit) {
      const defaultOrder = this.configService.get<Array<string>>('configureSidebar');
      if (defaultOrder) {
        this.routes = this.routes.filter(route =>
          defaultOrder.some(orderElement => orderElement.toUpperCase() === route.id));
      }
    }
  }

  private validateNavigationOrder(order: NavigationItem[]): boolean {
    if (order.length !== this.routes.length) {
      return false;
    }

    return order.every(el =>
        el.enabled != null && el.id != null && !!this.routes.find(route => route.id === el.id));
  }

  private navigationPredicate(order: NavigationItem[]) {
    return (a: NavigationItem, b: NavigationItem) =>
      order.findIndex(el => el.id === a.id) - order.findIndex(el => el.id === b.id);
  }

  private stringifyMenuState(routes: NavigationItem[]): string {
    return routes
      .map(el => `${el.id}:${+el.enabled}`)
      .join(';');
  }

  private parseMenuState(menuStateString: string): NavigationItem[] {
    return menuStateString
      .split(';')
      .filter(Boolean)
      .map((menuElement: string) => {
        const [id, enabled] = menuElement.split(':');
        return {
          id,
          enabled: enabled === '1'
        }
      });
  }
}
