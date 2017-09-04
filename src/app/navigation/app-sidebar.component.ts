import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { UserTagService } from 'app/shared/services/tags/user-tag.service';
import { DragulaService } from 'ng2-dragula';
import { Color } from '../shared/models/color.model';
import { ConfigService } from '../shared/services/config.service';
import { LayoutService } from '../shared/services/layout.service';
import { RouterUtilsService } from '../shared/services/router-utils.service';
import { StyleService } from '../shared/services/style.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';
import { transformHandle, transformLinks } from './sidebar-animations';
import {
  NavigationItem,
  navigationPredicate,
  nonDraggableRoutes,
  sideBarRoutes,
  validateNavigationOrder
} from './sidebar-routes';


@Component({
  selector: 'cs-app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
  animations: [transformHandle, transformLinks]
})
export class AppSidebarComponent extends WithUnsubscribe()
  implements AfterViewInit, OnInit, OnDestroy {
  // todo: make a wrapper for link and use @ViewChildren(LinkWrapper)
  @ViewChild('navigationBar') public navigationBar: ElementRef;
  @Input() public open: boolean;
  @Input() public title: string;

  public routes = sideBarRoutes.slice();
  public nonDraggableRoutes = nonDraggableRoutes;

  public themeColor;
  public navigationLoaded = false;
  public updatingOrder = false;
  public dragulaContainerName = 'sidebar-bag';

  private _editing = false;
  private hasChanges = false;

  constructor(
    private configService: ConfigService,
    private dragula: DragulaService,
    private styleService: StyleService,
    private layoutService: LayoutService,
    private routerUtilsService: RouterUtilsService,
    private router: Router,
    private userTagService: UserTagService
  ) {
    super();
  }

  public ngOnInit() {
    this.setUpDragula();
    this.fetchNavigationOrder();
  }

  public ngAfterViewInit(): void {
    this.layoutService.drawerToggled
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.toggleDrawer());

    this.styleService.paletteUpdates
      .takeUntil(this.unsubscribe$)
      .subscribe(color => this.setSidebarColor(color));
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

  public get isLightTheme(): boolean {
    return !this.themeColor || this.themeColor.textColor === '#FFFFFF';
  }

  public get linkActiveStyle(): string {
    return this.isLightTheme ? 'link-active-light' : 'link-active-dark';
  }

  public get logoSource(): string {
    return `img/cloudstack_logo_${this.isLightTheme ? 'light' : 'dark'}.png`;
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

      const newOrder: Array<NavigationItem> = this.routes.map(({ id, enabled }) => ({
        id,
        enabled
      }));
      this.userTagService
        .setNavigationOrder(JSON.stringify(newOrder))
        .finally(() => (this.updatingOrder = false))
        .subscribe();
    }
    this.toggleState();
  }

  public handleRouteChecked() {
    this.hasChanges = true;
  }

  @HostBinding('style.background')
  public get drawerBackground(): string {
    return !this.themeColor || !this.themeColor.value
      ? '#fafafa'
      : `${this.themeColor.value}`;
  }

  @HostBinding('style.color')
  public get drawerColor(): string {
    return !this.themeColor || !this.themeColor.value
      ? '#757575'
      : `${this.themeColor.textColor}`;
  }

  private setUpDragula(): void {
    this.dragula.setOptions(this.dragulaContainerName, {
      moves: () => this.editing
    });

    this.dragula.dropModel
      .takeUntil(this.unsubscribe$)
      .subscribe(() => (this.hasChanges = true));
  }

  private fetchNavigationOrder() {
    this.userTagService.getNavigationOrder().subscribe(tag => {
      this.navigationLoaded = true;
      if (tag) {
        let order;
        try {
          order = JSON.parse(tag);
        } catch (e) {
          return;
        }
        if (validateNavigationOrder(order)) {
          const predicate = navigationPredicate(order);
          this.routes.sort(predicate);
          this.routes.forEach((route, i) => route.enabled = order[i].enabled);
        }
      }
    });
  }

  private toggleState(): void {
    this._editing = !this._editing;
  }

  private setSidebarColor(color: Color): void {
    this.themeColor = color;
    if (this.navigationBar) {
      const links = this.navigationBar.nativeElement.querySelectorAll('a');
      const classesToRemove = this.isLightTheme
        ? ['link-active-dark', 'link-hover-dark']
        : ['link-active-light', 'link-hover-light'];

      links.forEach(link => link.classList.remove(...classesToRemove));
    }
  }
}
