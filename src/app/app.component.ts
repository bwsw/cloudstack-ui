import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MdlLayoutComponent } from 'angular2-mdl';


import '../style/app.scss';
import { Color } from './shared/models';

import {
  AuthService,
  ErrorService,
  INotificationService,
  LanguageService,
  LayoutService
} from './shared/services';
import { StyleService } from './shared/services/style.service';
import { ZoneService } from './shared/services/zone.service';
import { Router } from '@angular/router';


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
    private error: ErrorService,
    private languageService: LanguageService,
    private layoutService: LayoutService,
    private router: Router,
    @Inject('INotificationService') private notification: INotificationService,
    private styleService: StyleService,
    private zoneService: ZoneService
  ) {
    this.title = this.auth.name;
  }

  public componentSelected(mainLayout: MdlLayoutComponent): void {
    mainLayout.closeDrawerOnSmallScreens();
  }

  public ngOnInit(): void {
    this.loadSettings();

    this.error.subscribe(e => this.handleError(e));
    this.auth.loggedIn.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      this.updateAccount(this.loggedIn);
      if (loggedIn) {
        this.loadSettings();
        this.zoneService.areAllZonesBasic().subscribe(basic => this.disableSecurityGroups = basic);
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

  public onLogout(event): void {
    event.preventDefault();
    this.auth.logout().subscribe(() => {
      this.router.navigate(['login']);
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
    return `/img/cloudstack_logo_${ this.isLightTheme ? 'light' : 'dark' }.png`;
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
          this.auth.setLoggedOut();
          this.router.navigate(['/logout']);
          break;
      }
    }
  }

  private loadSettings(): void {
    this.languageService.applyLanguage();
    this.styleService.loadPalette();
  }
}
