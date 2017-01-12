import { Component, Inject } from '@angular/core';
import { Response } from '@angular/http';

import { ApiService } from './shared';
import { AuthService } from './shared/services';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { ErrorService } from './shared/services/error.service';
import { INotificationService } from './shared/notification.service';

import '../style/app.scss';
import { ResourceUsageService } from './shared/services/resource-usage.service';
import { AsyncJobService } from './shared/services/async-job.service';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public url = 'https://github.com/preboot/angular2-webpack';
  private loggedIn: boolean;
  private title: string;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private error: ErrorService,
    @Inject('INotificationService') private notification: INotificationService,
    private resourceUsageService: ResourceUsageService,
    private asyncJobService: AsyncJobService
  ) {
    // Do something with api
    this.title = this.auth.name;
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.error.subscribe(e => this.handleError(e));
    this.auth.isLoggedIn().then(r => this.loggedIn = r);
    this.auth.loggedIn.subscribe(loggedIn => {
      this.updateAccount(loggedIn);
    });
  }

  public test(): void {
    this.asyncJobService.checkCurrentJobs();
  }

  private updateAccount(loggedIn: boolean ): void {
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
