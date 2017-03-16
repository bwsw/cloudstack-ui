import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';

import { AuthService } from './shared/services';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { ErrorService } from './shared/services/error.service';
import { INotificationService } from './shared/services/notification.service';
import { LanguageService } from './shared/services/language.service';
import { MdlLayoutComponent } from 'angular2-mdl';

import '../style/app.scss';
import { StyleService } from './shared/services/style.service';
import { ZoneService } from './shared/services/zone.service';
import { Color } from './shared/models/color.model';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';


@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('settingsLink') public settingsLink: ElementRef;
  public loggedIn: boolean;
  public title: string;
  public disableSecurityGroups = false;

  public themeColor: Color;

  constructor(
    private auth: AuthService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private translate: TranslateService,
    private error: ErrorService,
    private languageService: LanguageService,
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
    this.languageService.applyLanguage();
    this.styleService.loadPalette();

    this.error.subscribe(e => this.handleError(e));
    this.auth.isLoggedIn().subscribe(r => this.loggedIn = r);
    this.auth.loggedIn.subscribe(loggedIn => {
      this.updateAccount(loggedIn);
      if (loggedIn) {
        this.zoneService.areAllZonesBasic()
          .subscribe(basic => this.disableSecurityGroups = basic);
      }
    });
  }

  public ngAfterViewInit(): void {
    this.styleService.paletteUpdates.subscribe(color => {
      this.themeColor = color;
      if (this.settingsLink) {
        if (this.isLightTheme) {
          this.settingsLink.nativeElement.classList.remove('link-active-dark', 'link-hover-dark');
        } else {
          this.settingsLink.nativeElement.classList.remove('link-active-light', 'link-hover-dark');
        }
      }
    });
  }

  public get drawerStyles(): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(
      `background-color: ${this.themeColor.value} !important;
       color: ${this.themeColor.textColor} !important`,
    );
  }

  public get linkActiveStyle(): string {
    return this.isLightTheme ? 'link-active-light' : 'link-active-dark';
  }

  public get isLightTheme(): boolean {
    if (!this.themeColor) {
      return false;
    }
    return this.themeColor.textColor === '#FFFFFF';
  }

  public logout(): void {
    this.auth.logout()
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }

  private updateAccount(loggedIn: boolean): void {
    this.loggedIn = loggedIn;
    if (loggedIn) {
      this.title = this.auth.name;
    } else {
      this.router.navigate(['/login'])
        .then(() => location.reload());
    }
  }

  private handleError(e: any): void {
    if (e instanceof Response) {
      switch (e.status) {
        case 401:
          this.translate.get('NOT_LOGGED_IN').subscribe(result => this.notification.message(result));
          this.auth.setLoggedOut();
          break;
        case 431:
          this.translate.get('WRONG_ARGUMENTS').subscribe(result => this.notification.message(result));
          break;
      }
    } else {
      this.translate.get('UNEXPECTED_ERROR').subscribe(result => this.notification.message(result));
    }
  }
}
