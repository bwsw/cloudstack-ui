import { MdlLayoutComponent } from '@angular-mdl/core';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import '../style/app.scss';
import { MdlDialogService } from './dialog/dialog-module';
import { Color } from './shared/models';
import {
  ErrorService,
  LanguageService,
  LayoutService,
  NotificationService
} from './shared/services';
import { AsyncJobService } from './shared/services/async-job.service';
import { AuthService } from './shared/services/auth.service';
import { CacheService } from './shared/services/cache.service';
import { MemoryStorageService } from './shared/services/memory-storage.service';
import { RouterUtilsService } from './shared/services/router-utils.service';
import { SessionStorageService } from './shared/services/session-storage.service';
import { StyleService } from './shared/services/style.service';
import { ZoneService } from './shared/services/zone.service';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MdlLayoutComponent) public layoutComponent: MdlLayoutComponent;
  public loggedIn: boolean;
  public title: string;
  public disableSecurityGroups = false;

  constructor(
    private auth: AuthService,
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
    private routerUtilsService: RouterUtilsService,
    private zoneService: ZoneService,
    private zone: NgZone
  ) {
    this.title = this.auth.name;
  }

  public ngOnInit(): void {
    this.loadSettings();

    this.error.subscribe(e => this.handleError(e));
    this.auth.loggedIn.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
      this.updateAccount(this.loggedIn);
      if (isLoggedIn) {
        this.auth.startInactivityCounter();
        this.loadSettings();
        this.zoneService
          .areAllZonesBasic()
          .subscribe(basic => (this.disableSecurityGroups = basic));
      } else {
        this.auth.clearInactivityTimer();
      }
      this.asyncJobService.completeAllJobs();
      this.cacheService.invalidateAll();
      this.storageReset();
    });

    this.captureScrollEvents();
    this.toggleDialogOverlay();
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

  public get isDrawerOpen(): boolean {
    return this.layoutService.drawerOpen;
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
