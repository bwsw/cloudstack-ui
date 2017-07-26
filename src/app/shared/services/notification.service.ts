import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ParametrizedTranslation } from '../../dialog/dialog-module/dialog.service';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class NotificationService implements NotificationService {
  public timeout: number;

  constructor(
    private snackBar: MdSnackBar,
    private translateService: TranslateService
  ) {
    this.timeout = 2750;
  }

  public message(message: string | ParametrizedTranslation): any {
    return this.getTranslatedMessage(message)
      .subscribe(translatedMessage => this.snackBar.open(translatedMessage));
  }

  public warning(
    message: string | ParametrizedTranslation,
    action?:  string
  ) {
   return this.getTranslatedMessage(message)
     .subscribe( translatedMessage => this.snackBar.open(translatedMessage, action));
  }

  public error(
    message: string | ParametrizedTranslation,
    action?: string
    ) {
    return this.getTranslatedMessage(message)
      .subscribe( translatedMessage => this.snackBar.open(translatedMessage, action));
  }

  private getTranslatedMessage(message: string | ParametrizedTranslation): Observable<string> {
    if (typeof message === 'string') {
      return this.translateService.get(message);
    } else {
      return this.translateService.get(message.translationToken, message.interpolateParams);
    }
  }
}
