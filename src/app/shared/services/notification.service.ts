import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ParametrizedTranslation } from '../../dialog/dialog-module/dialog.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Injectable()
export class NotificationService implements NotificationService {
  public snackBarConfig: MdSnackBarConfig;

  constructor(
    private snackBar: MdSnackBar,
    private translateService: TranslateService
  ) {
    this.snackBarConfig = { duration: 3000 };
  }

  public message(
    message: string | ParametrizedTranslation,
    config?: MdSnackBarConfig
  ): any {
    if (config) {
      this.snackBarConfig = config;
    }

    return this.getTranslatedMessage(message)
      .subscribe(translatedMessage => this.snackBar
        .open(translatedMessage, null, this.snackBarConfig));
  }

  public warning(
    message: string | ParametrizedTranslation,
    action: string,
    config?: MdSnackBarConfig
  ) {
    if (config) {
      this.snackBarConfig = config;
    }

    return this.getTranslatedMessage(message)
      .subscribe(translatedMessage => this.snackBar
        .open(translatedMessage, action, this.snackBarConfig));
  }

  public error(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MdSnackBarConfig
  ) {
    if (config) {
      this.snackBarConfig = config;
    }

    return this.getTranslatedMessage(message)
      .subscribe(translatedMessage => this.snackBar
        .open(translatedMessage, action, this.snackBarConfig));
  }

  private getTranslatedMessage(message: string | ParametrizedTranslation): Observable<string> {
    if (typeof message === 'string') {
      return this.translateService.get(message);
    } else {
      return this.translateService.get(
        message.translationToken,
        message.interpolateParams
      );
    }
  }
}
