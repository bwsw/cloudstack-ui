import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AlertDialogConfiguration } from '../../app/dialog/dialog-service/alert-dialog/alert-dialog.component';
import { ConfirmDialogConfiguration } from '../../app/dialog/dialog-service/confirm-dialog/confirm-dialog.component';

@Injectable()
export class MockDialogService {
  public alert(config: AlertDialogConfiguration): Observable<void> {
    return of(null);
  }

  public confirm(config: ConfirmDialogConfiguration): Observable<boolean> {
    return of(true);
  }
  public showNotificationsOnFail(config: AlertDialogConfiguration): Observable<void> {
    return of(null);
  }
}
