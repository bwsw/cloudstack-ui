import { Injectable } from '@angular/core';
import { MdlSnackbarService, MdlSnackbarComponent } from 'angular2-mdl';

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

  public showNotification(message: string): Promise<MdlSnackbarComponent> {
    return this.snackbar.showSnackbar({ message, timeout: this._timeout }).toPromise();
  }

  public showWarning(message: string, action: ISnackbarAction): Promise<MdlSnackbarComponent> {
    return this.snackbar.showSnackbar({ message, action })
      .toPromise()
      .then(result => {
        setTimeout(() => result.hide(), this._timeout);
        return result;
      });
  }

  public showError(message: string, action: ISnackbarAction): Promise<MdlSnackbarComponent> {
    return this.snackbar.showSnackbar({ message, action }).toPromise();
  }
}
