import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ParametrizedTranslation } from '../../dialog/dialog-service/dialog.service';

@Injectable()
export class NotificationService {
  public snackBarConfig: MatSnackBarConfig;

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.snackBarConfig = { duration: 2750 };
  }

  public message(
    message: string | ParametrizedTranslation,
    config?: MatSnackBarConfig
  ): any {
    return this.getTranslatedMessage(message)
      .subscribe(translatedMessage => this.snackBar
        .open(translatedMessage, null, this.getConfig(config)));
  }

  public warning(
    message: string | ParametrizedTranslation,
    action: string,
    config?: MatSnackBarConfig
  ) {
    return this.getTranslatedMessage(message)
      .subscribe(translatedMessage => this.snackBar
        .open(translatedMessage, action, this.getConfig(config)));
  }

  public error(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MatSnackBarConfig
  ) {
    return this.getTranslatedMessage(message)
      .subscribe(translatedMessage => this.snackBar
        .open(translatedMessage, action, this.getConfig(config)));
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

  private getConfig(config): MatSnackBarConfig {
    return config ? config : this.snackBarConfig;
  }
}
