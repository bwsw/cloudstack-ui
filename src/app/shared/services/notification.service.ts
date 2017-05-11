import { Injectable } from '@angular/core';
import { MdlSnackbarService, MdlSnackbarComponent } from 'angular2-mdl';
import { Observable } from 'rxjs/Observable';

interface INotificationAction {
  handler: () => void;
  text: string;
}

@Injectable()
export class NotificationService implements NotificationService {
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
