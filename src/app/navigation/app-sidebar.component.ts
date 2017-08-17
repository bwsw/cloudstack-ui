import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { LayoutService } from '../shared/services/layout.service';
import { RouterUtilsService } from '../shared/services/router-utils.service';
import { StyleService } from '../shared/services/style.service';
import { UserService } from '../shared/services/user.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';
import { transformHandle, transformLinks } from './sidebar-animations';

const navigationOrderTag = 'csui.user.navigation-order';

@Component({
  selector: 'cs-app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
  // tslint:disable-next-line
  host: {
    '[style]': 'drawerStyles'
  },
  animations: [
    transformHandle,
    transformLinks
  ]
})
export class AppSidebarComponent extends WithUnsubscribe()
  implements AfterViewInit, OnInit {
  // todo: make a wrapper for link and use @ViewChildren(LinkWrapper)
  @ViewChild('navigationBar') public navigationBar: ElementRef;
  @Input() public open: boolean;
  @Input() public title: string;

  public routes = [
    {
      path: '/instances',
      text: 'VM_NAVBAR',
      icon: 'cloud',
      id: 'VMS'
    },
    {
      path: '/spare-drives',
      text: 'SPARE_DRIVES_NAVBAR',
      icon: 'dns',
      id: 'VOLUMES'
    },
    {
      path: '/templates',
      text: 'IMAGES',
      icon: 'disc',
      className: 'disc-icon',
      id: 'TEMPLATES'
    },
    {
      path: '/sg-templates',
      text: 'FIREWALL',
      icon: 'security',
      id: 'SGS'
    },
    {
      path: '/events',
      text: 'ACTIVITY_LOG',
      icon: 'event_note',
      id: 'EVENTS'
    },
    {
      path: '/ssh-keys',
      text: 'SSH_KEYS',
      icon: 'vpn_key',
      id: 'SSH'
    },
    {
      path: '/settings',
      text: 'SETTINGS',
      icon: 'settings',
      id: 'SETTINGS'
    },
    {
      path: '/logout',
      text: 'LOGOUT',
      icon: 'exit_to_app',
      id: 'LOGOUT'
    }
  ];

  public themeColor;
  public updatingOrder = false;
  public dragulaContainerName = 'navbar-bag';

  private _state: 'editing' | 'idle' = 'idle';
  private hasChanges = false;

  constructor(
    private dragula: DragulaService,
    private styleService: StyleService,
    private layoutService: LayoutService,
    private routerUtilsService: RouterUtilsService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private userService: UserService
  ) {
    super();
  }

  public ngOnInit() {
    this.layoutService.drawerToggled
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.toggleDrawer());

    this.dragula.setOptions(this.dragulaContainerName, {
      moves: (el, container, handle) => {
        return this.editing;
      }
    });

    this.dragula.dropModel
      .takeUntil(this.unsubscribe$)
      .subscribe(() => (this.hasChanges = true));

    this.fetchNavigationOrder();
  }

  public ngAfterViewInit(): void {
    this.styleService.paletteUpdates
      .takeUntil(this.unsubscribe$)
      .subscribe(color => {
        this.themeColor = color;
        if (this.navigationBar) {
          if (this.isLightTheme) {
            this.navigationBar.nativeElement.querySelectorAll('a').forEach(link => {
              link.classList.remove('link-active-dark', 'link-hover-dark');
            });
          } else {
            this.navigationBar.nativeElement.querySelectorAll('a').forEach(link => {
              link.classList.remove('link-active-light', 'link-hover-light');
            });
          }
        }
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dragula.destroy(this.dragulaContainerName);
  }

  public get state(): string {
    return this._state;
  }

  public get editing(): boolean {
    return this._state === 'editing';
  }

  public get isLightTheme(): boolean {
    if (!this.themeColor) {
      return true;
    }
    return this.themeColor.textColor === '#FFFFFF';
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
    if (this._state === 'editing' && this.hasChanges) {
      this.hasChanges = false;
      this.updatingOrder = true;
      this.userService
        .writeTag(navigationOrderTag, this.routes.map(_ => _.id).join(';'))
        .finally(() => (this.updatingOrder = false))
        .subscribe();
    }
    this.toggleState();
  }

  public get drawerStyles(): SafeStyle {
    const styleString =
      !this.themeColor || !this.themeColor.value
        ? `background-color: #fafafa !important; color: #757575 !important`
        : `background-color: ${this.themeColor.value} !important;
        color: ${this.themeColor.textColor} !important`;

    return this.domSanitizer.bypassSecurityTrustStyle(styleString);
  }

  private fetchNavigationOrder() {
    this.userService.readTag(navigationOrderTag).subscribe(tag => {
      if (tag) {
        const order = tag.split(';');
        this.routes.sort((a, b) => {
          let positionA = order.indexOf(a.id);
          if (positionA === -1) {
            positionA = Infinity;
          }
          let positionB = order.indexOf(b.id);
          if (positionB === -1) {
            positionB = Infinity;
          }

          return positionA - positionB;
        });
      }
    });
  }

  private toggleState(): void {
    this._state = this._state === 'editing' ? 'idle' : 'editing';
  }
}
