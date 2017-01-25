import { Component, Inject } from '@angular/core';
import { Response } from '@angular/http';

import { AuthService } from './shared/services';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { ErrorService } from './shared/services/error.service';
import { INotificationService } from './shared/services/notification.service';
import { MdlLayoutComponent } from 'angular2-mdl';

import '../style/app.scss';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private loggedIn: boolean;
  private title: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private error: ErrorService,
    @Inject('INotificationService') private notification: INotificationService
  ) {
    this.title = this.auth.name;
    this.translate.setDefaultLang('ru');
    this.translate.use('ru');
    this.error.subscribe(e => this.handleError(e));
    this.auth.isLoggedIn().subscribe(r => this.loggedIn = r);
    this.auth.loggedIn.subscribe(loggedIn => {
      this.updateAccount(loggedIn);
    });
  }

  public componentSelected(mainLayout: MdlLayoutComponent) {
    mainLayout.closeDrawerOnSmallScreens();
  }

  private updateAccount(loggedIn: boolean): void {
    this.loggedIn = loggedIn;
    if (loggedIn) {
      this.title = this.auth.name;
    } else {
      this.router.navigate(['/login']);
    }
  }

  private handleError(e: any): void {
    if (e instanceof Response) {
      switch (e.status) {
        case 401:
          this.translate.get('NOT_LOGGED_IN').subscribe(result => this.notification.message(result));
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
