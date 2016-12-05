import { Injectable } from '@angular/core';
import { MdlSnackbarService, MdlSnackbarComponent } from 'angular2-mdl';
import { Observable } from 'rxjs';

interface ISnackbarAction {
  handler: () => void;
  text: string;
}

@Injectable()
export class NotificationService {

  private _timeout: number;

  constructor(private snackbar: MdlSnackbarService) {
    this._timeout = 2750;
  }

  set timeout(timeout: number) {
    this._timeout = timeout;
  }

  public showNotification(message: string): Observable<MdlSnackbarComponent> {
    return this.snackbar.showSnackbar({ message, timeout: this._timeout });
  }

  public showWarning(message: string, action: ISnackbarAction): Observable<MdlSnackbarComponent> {
    let obs = this.snackbar.showSnackbar({ message, action });
    obs.subscribe(result => {
      setTimeout(() => {
        result.hide();
      }, this._timeout);
      return result;
    });
    return obs;
  }

  public showError(message: string, action: ISnackbarAction): Observable<MdlSnackbarComponent> {
    return this.snackbar.showSnackbar({ message, action });
  }
}
