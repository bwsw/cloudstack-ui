import { Injectable } from '@angular/core';
import { MdlSnackbarService, MdlSnackbarComponent } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ParametrizedTranslation } from '../../dialog/dialog-module/dialog.service';
import { Subject } from 'rxjs/Subject';

interface INotificationAction {
  handler: () => void;
  text: string;
}

@Injectable()
export class NotificationService implements NotificationService {
  public timeout: number;

  constructor(
    private snackbar: MdlSnackbarService,
    private translateService: TranslateService
  ) {
    this.timeout = 2750;
  }

  public message(message: string | ParametrizedTranslation): Observable<MdlSnackbarComponent> {
    let obs = new Subject<MdlSnackbarComponent>();
    this.getTranslatedMessage(message)
      .switchMap(translatedMessage => {
        return this.snackbar.showSnackbar({
          message: translatedMessage,
          timeout: this.timeout
        });
      })
      .subscribe(result => obs.next(result));
    return obs;
  }

  public warning(
    message: string | ParametrizedTranslation,
    action: INotificationAction = {
      handler: () => {},
      text: 'OK'
    }): Observable<MdlSnackbarComponent> {
    let obs = new Subject<MdlSnackbarComponent>();
    this.getTranslatedMessage(message)
      .switchMap(translatedMessage => {
        return this.snackbar.showSnackbar({message: translatedMessage, action});
      })
      .subscribe(result => {
        setTimeout(() => {
          result.hide();
        }, this.timeout);
        obs.next(result);
      });
    return obs;
  }

  public error(
    message: string | ParametrizedTranslation,
    action: INotificationAction = {
      handler: () => {},
      text: 'OK'
    }): Observable<MdlSnackbarComponent> {
    let obs = new Subject<MdlSnackbarComponent>();
    this.getTranslatedMessage(message)
      .switchMap(translatedMessage => {
        return this.snackbar.showSnackbar({
          message: translatedMessage,
          action
        });
      })
      .subscribe(result => obs.next(result));
    return obs;
  }

  private getTranslatedMessage(message: string | ParametrizedTranslation): Observable<string> {
    if (typeof message === 'string') {
      return this.translateService.get(message);
    } else {
      return this.translateService.get(message.translationToken, message.interpolateParams);
    }
  }
}
