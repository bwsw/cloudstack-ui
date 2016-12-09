import { Component, Inject } from '@angular/core';
import { Response } from '@angular/http';

import { ApiService } from './shared';
import { TranslateService } from 'ng2-translate';
import { ErrorService } from './shared/services/error.service';
import { INotificationService } from './shared/notification.service';

import '../style/app.scss';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public url = 'https://github.com/preboot/angular2-webpack';

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private error: ErrorService,
    @Inject('INotificationService') private notification: INotificationService
  ) {
    // Do something with api
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.error.errorObservable.subscribe(error => this.handleError(error));
  }

  private handleError(error: any): void {
    if (error instanceof Response) {
      switch (error.status) {
        case 401:
          this.notification.message('You are not logged in');
          break;
        case 431:
          this.notification.message('Wrong arguments');
          break;
      }
    } else {
      this.notification.message('Unexpected error');
    }
  }
}
