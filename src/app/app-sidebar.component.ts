import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LayoutService } from './shared/services/layout.service';
import { RouterUtilsService } from './shared/services/router-utils.service';
import { StyleService } from './shared/services/style.service';
import { WithUnsubscribe } from './utils/mixins/with-unsubscribe';

@Component({
  selector: 'cs-app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
  // tslint:disable-next-line
  host: {
    '[style]': 'drawerStyles'
  }
})
export class AppSidebarComponent extends WithUnsubscribe()
  implements AfterViewInit, OnInit {
  // todo: make a wrapper for link and use @ViewChildren(LinkWrapper)
  @ViewChild('navigationBar') public navigationBar: ElementRef;
  @Input() public open: boolean;
  @Input() public title: string;
  @Output() public toggle = new EventEmitter();

  public routes = [
    {
      path: '/instances',
      text: 'VM_NAVBAR',
      icon: 'cloud'
    },
    {
      path: '/spare-drives',
      text: 'SPARE_DRIVES_NAVBAR',
      icon: 'dns'
    },
    {
      path: '/templates',
      text: 'IMAGES',
      icon: 'disc',
      className: 'disc-icon'
    },
    {
      path: '/sg-templates',
      text: 'FIREWALL',
      icon: 'security'
    },
    {
      path: '/events',
      text: 'ACTIVITY_LOG',
      icon: 'event_note'
    },
    {
      path: '/ssh-keys',
      text: 'SSH_KEYS',
      icon: 'vpn_key'
    },
    {
      path: '/settings',
      text: 'SETTINGS',
      icon: 'settings'
    },
    {
      path: '/logout',
      text: 'LOGOUT',
      icon: 'exit_to_app'
    }
  ];

  public themeColor;

  constructor(
    private styleService: StyleService,
    private layoutService: LayoutService,
    private routerUtilsService: RouterUtilsService,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {
    this.layoutService.drawerToggled
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.toggleDrawer());
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

  public get drawerStyles(): SafeStyle {
    const styleString =
      !this.themeColor || !this.themeColor.value
        ? `background-color: #fafafa !important; color: #757575 !important`
        : `background-color: ${this.themeColor.value} !important;
        color: ${this.themeColor.textColor} !important`;

    return this.domSanitizer.bypassSecurityTrustStyle(styleString);
  }
}
