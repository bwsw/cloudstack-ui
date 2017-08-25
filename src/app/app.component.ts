import { MdlLayoutComponent } from '@angular-mdl/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import { Response } from '@angular/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import '../style/app.scss';
import { MdlDialogService } from './dialog/dialog-module';
import { Color } from './shared/models';
import { AsyncJobService } from './shared/services/async-job.service';
import { AuthService } from './shared/services/auth.service';
import { CacheService } from './shared/services/cache.service';
import { ErrorService } from './shared/services/error.service';
import { LanguageService } from './shared/services/language.service';
import { LayoutService } from './shared/services/layout.service';
import { MemoryStorageService } from './shared/services/memory-storage.service';
import { NotificationService } from './shared/services/notification.service';
import { RouterUtilsService } from './shared/services/router-utils.service';
import { SessionStorageService } from './shared/services/session-storage.service';
import { StyleService } from './shared/services/style.service';
import { UserService } from './shared/services/user.service';
import { ZoneService } from './shared/services/zone.service';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    private asyncJobService: AsyncJobService,
    private cacheService: CacheService,
    private sessionStorage: SessionStorageService,
    private memoryStorage: MemoryStorageService,
    private layoutService: LayoutService,
    private mdlDialogService: MdlDialogService,
    private notification: NotificationService,
    private styleService: StyleService,
    private userService: UserService,
    private routerUtilsService: RouterUtilsService,
    private zoneService: ZoneService,
    private zone: NgZone
  ) {
    this.title = (this.auth.user && this.auth.user.name) || '';
  }

  public linkClick(routerLink: string): void {
    if (routerLink === this.routerUtilsService.getRouteWithoutQueryParams()) {
      this.router.navigate(['reload'], {
        queryParamsHandling: 'preserve'
      });
    }
  }

  public ngOnInit(): void {
    this.loadSettings();

    this.error.subscribe(e => this.handleError(e));
    this.auth.loggedIn.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
      this.updateAccount(this.loggedIn);
      if (isLoggedIn) {
        this.userService.startInactivityCounter();
        this.loadSettings();
        this.zoneService
          .areAllZonesBasic()
          .subscribe(basic => (this.disableSecurityGroups = basic));
      } else {
        this.userService.clearInactivityTimer();
      }
      this.asyncJobService.completeAllJobs();
      this.cacheService.invalidateAll();
      this.storageReset();
    });

    this.layoutService.drawerToggled.subscribe(() => {
      this.toggleDrawer();
    });

    this.captureScrollEvents();
    this.toggleDialogOverlay();
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
    return new Date().getFullYear().toString();
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
    return `img/cloudstack_logo_${this.isLightTheme ? 'light' : 'dark'}.png`;
  }

  private updateAccount(loggedIn: boolean): void {
    if (loggedIn) {
      this.title = this.auth.user.name;
    }
  }

  private handleError(e: any): void {
    if (e instanceof Response) {
      switch (e.status) {
        case 401:
          this.notification.message('AUTH.NOT_LOGGED_IN');
          const route = this.routerUtilsService.getRouteWithoutQueryParams();
          if (route !== '/login' && route !== '/logout') {
            this.router.navigate(
              ['/logout'],
              this.routerUtilsService.getRedirectionQueryParams()
            );
          }
          break;
      }
    }
  }

  private loadSettings(): void {
    this.languageService.applyLanguage();
    this.styleService.loadPalette();
  }

  private captureScrollEvents(): void {
    const useCapture = true;
    this.zone.runOutsideAngular(() => {
      document
        .querySelector('.dialog-container')
        .addEventListener('scroll', e => e.stopPropagation(), useCapture);
    });
  }

  private toggleDialogOverlay(): void {
    this.mdlDialogService.onDialogsOpenChanged.subscribe(open => {
      if (open) {
        document
          .querySelector('.dialog-container')
          .classList.add('dialog-container-overlay');
      } else {
        document
          .querySelector('.dialog-container')
          .classList.remove('dialog-container-overlay');
      }
    });
  }

  private storageReset() {
    this.sessionStorage.reset();
    this.memoryStorage.reset();
  }
}
