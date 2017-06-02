import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Response } from '@angular/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MdlLayoutComponent } from '@angular-mdl/core';

import '../style/app.scss';
import {
  AsyncJobService,
  AuthService,
  Color,
  ErrorService,
  LanguageService,
  LayoutService,
  NotificationService,
  StyleService,
  ZoneService
} from './shared';
import { RouterUtilsService } from './shared/services/router-utils.service';


@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  // todo: make a wrapper for link and use @ViewChildren(LinkWrapper)
  @ViewChild('navigationBar') public navigationBar: ElementRef;


  @ViewChild(MdlLayoutComponent) public layoutComponent: MdlLayoutComponent;
  public loggedIn: boolean;
  public title: string;
  public disableSecurityGroups = false;

  public themeColor: Color;

  constructor(
    private auth: AuthService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private error: ErrorService,
    private languageService: LanguageService,
    private layoutService: LayoutService,
    private notification: NotificationService,
    private styleService: StyleService,
    private asyncJobService: AsyncJobService,
    private routerUtilsService: RouterUtilsService,
    private zoneService: ZoneService
  ) {
    this.title = this.auth.name;
  }

  public linkClick(routerLink: string): void {
    if (routerLink === this.routerUtilsService.getRouteWithoutQueryParams()) {
      this.router.navigate(['reload'], {
        queryParamsHandling: 'preserve',
        skipLocationChange: true
      });
    }
  }

  public ngOnInit(): void {
    this.loadSettings();

    this.error.subscribe(e => this.handleError(e));
    this.auth.loggedIn.subscribe(loggedIn => {
      this.loggedIn = loggedIn === 'login';
      this.updateAccount(this.loggedIn);
      if (loggedIn === 'login') {
        this.loadSettings();
        this.zoneService.areAllZonesBasic().subscribe(basic => this.disableSecurityGroups = basic);
      } else {
        this.asyncJobService.completeAllJobs();
        if (this.router.url !== '/login' && this.router.url !== '/') {
          this.router.navigate(['/logout'], { queryParams: { loggedIn } });
        }
      }
    });

    this.layoutService.drawerToggled.subscribe(() => {
      this.toggleDrawer();
    });
  }

  public ngAfterViewInit(): void {
    this.styleService.paletteUpdates.subscribe(color => {
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

  public get currentYear(): string {
    return (new Date).getFullYear().toString();
  }

  public get drawerStyles(): SafeStyle {
    let styleString;

    if (!this.themeColor || !this.themeColor.value) {
      styleString = `background-color: #fafafa !important; color: #757575 !important`;
    } else {
      styleString = `background-color: ${this.themeColor.value} !important;
        color: ${this.themeColor.textColor} !important`;
    }

    return this.domSanitizer.bypassSecurityTrustStyle(styleString);
  }

  public get linkActiveStyle(): string {
    return this.isLightTheme ? 'link-active-light' : 'link-active-dark';
  }

  public get isLightTheme(): boolean {
    if (!this.themeColor) {
      return true;
    }
    return this.themeColor.textColor === '#FFFFFF';
  }

  public get isDrawerOpen(): boolean {
    return this.layoutService.drawerOpen;
  }

  public toggleDrawer(): void {
    this.layoutService.toggleDrawer();
  }

  public get logoSource(): string {
    return `img/cloudstack_logo_${ this.isLightTheme ? 'light' : 'dark' }.png`;
  }

  private updateAccount(loggedIn: boolean): void {
    if (loggedIn) {
      this.title = this.auth.name;
    }
  }

  private handleError(e: any): void {
    if (e instanceof Response) {
      switch (e.status) {
        case 401:
          this.notification.message('NOT_LOGGED_IN');
          this.auth.setLoggedOut('reset');
          break;
      }
    }
  }

  private loadSettings(): void {
    this.languageService.applyLanguage();
    this.styleService.loadPalette();
  }
}
