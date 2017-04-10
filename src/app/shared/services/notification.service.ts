import { Injectable } from '@angular/core';
import { MdlSnackbarService, MdlSnackbarComponent } from 'angular2-mdl';
import { Observable } from 'rxjs/Rx';

interface INotificationAction {
  handler: () => void;
  text: string;
}

export interface INotificationService {
  timeout: number;
  message(message: string): Observable<MdlSnackbarComponent>;
  warning(message: string, action: INotificationAction): Observable<MdlSnackbarComponent>;
  error(message: string, action: INotificationAction): Observable<MdlSnackbarComponent>;
}

@Injectable()
export class NotificationService implements INotificationService {
  public timeout: number;

  constructor(private snackbar: MdlSnackbarService) {
    this.timeout = 2750;
  }

  public message(message: string): Observable<MdlSnackbarComponent> {
    return this.snackbar.showSnackbar({ message, timeout: this.timeout });
  }

  public warning(
    message: string,
    action: INotificationAction = {
      handler: () => {},
      text: 'OK'
    }): Observable<MdlSnackbarComponent> {
    let obs = this.snackbar.showSnackbar({ message, action });
    obs.subscribe(result => {
      setTimeout(() => {
        result.hide();
      }, this.timeout);
      return result;
    });
    return obs;
  }

  public error(
    message: string,
    action: INotificationAction = {
      handler: () => {},
      text: 'OK'
    }): Observable<MdlSnackbarComponent> {
    return this.snackbar.showSnackbar({ message, action });
  }
}

export class MockNotificationService implements INotificationService {
  public timeout: number;

  public message(_message: string): Observable<MdlSnackbarComponent> {
    return new Observable<MdlSnackbarComponent>();
  };

  public warning(_message: string, _action: INotificationAction): Observable<MdlSnackbarComponent> {
    return new Observable<MdlSnackbarComponent>();
  };

  public error(_message: string, _action: INotificationAction): Observable<MdlSnackbarComponent> {
    return new Observable<MdlSnackbarComponent>();
  };
}
